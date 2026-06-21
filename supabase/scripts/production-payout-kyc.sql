-- Run in production: https://supabase.com/dashboard/project/doqiuduigbdoczdzsima/sql/new
-- One-time payout KYC per account before ClashCoins withdrawals.

create table if not exists public.payout_kyc_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  phone text not null,
  address text not null,
  id_document_url text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  admin_notes text,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payout_kyc_submissions_user_idx
  on public.payout_kyc_submissions (user_id, created_at desc);

create index if not exists payout_kyc_submissions_status_idx
  on public.payout_kyc_submissions (status, created_at desc);

create unique index if not exists payout_kyc_submissions_pending_user_idx
  on public.payout_kyc_submissions (user_id)
  where status = 'pending';

create unique index if not exists payout_kyc_submissions_approved_user_idx
  on public.payout_kyc_submissions (user_id)
  where status = 'approved';

alter table public.payout_kyc_submissions enable row level security;

drop policy if exists payout_kyc_submissions_select_own on public.payout_kyc_submissions;
create policy payout_kyc_submissions_select_own
  on public.payout_kyc_submissions for select
  using (auth.uid() = user_id or public.is_staff());

drop policy if exists payout_kyc_submissions_insert_own on public.payout_kyc_submissions;
create policy payout_kyc_submissions_insert_own
  on public.payout_kyc_submissions for insert
  with check (auth.uid() = user_id);

drop policy if exists payout_kyc_submissions_update_staff on public.payout_kyc_submissions;
create policy payout_kyc_submissions_update_staff
  on public.payout_kyc_submissions for update
  using (public.is_staff())
  with check (public.is_staff());

create or replace function public.user_has_approved_payout_kyc(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.payout_kyc_submissions
    where user_id = target_user_id
      and status = 'approved'
  );
$$;

create or replace function public.submit_payout_kyc(
  p_phone text,
  p_address text,
  p_id_document_url text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_phone text;
  normalized_address text;
  normalized_url text;
  submission_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  normalized_phone := regexp_replace(trim(coalesce(p_phone, '')), '\s+', ' ', 'g');
  normalized_address := trim(coalesce(p_address, ''));
  normalized_url := trim(coalesce(p_id_document_url, ''));

  if char_length(normalized_phone) < 7 then
    raise exception 'valid phone number required';
  end if;

  if char_length(normalized_address) < 10 then
    raise exception 'valid address required';
  end if;

  if char_length(normalized_url) < 10 then
    raise exception 'id document image required';
  end if;

  if public.user_has_approved_payout_kyc(auth.uid()) then
    raise exception 'payout kyc already approved';
  end if;

  if exists (
    select 1
    from public.payout_kyc_submissions
    where user_id = auth.uid()
      and status = 'pending'
  ) then
    raise exception 'payout kyc submission pending';
  end if;

  insert into public.payout_kyc_submissions (
    user_id,
    phone,
    address,
    id_document_url,
    status
  )
  values (
    auth.uid(),
    normalized_phone,
    normalized_address,
    normalized_url,
    'pending'
  )
  returning id into submission_id;

  return submission_id;
end;
$$;

create or replace function public.resolve_payout_kyc(
  p_submission_id uuid,
  p_status text,
  p_admin_notes text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  if p_status not in ('approved', 'rejected') then
    raise exception 'invalid kyc status';
  end if;

  update public.payout_kyc_submissions
  set
    status = p_status,
    admin_notes = nullif(trim(coalesce(p_admin_notes, '')), ''),
    reviewed_by = auth.uid(),
    reviewed_at = now(),
    updated_at = now()
  where id = p_submission_id
    and status = 'pending';

  if not found then
    raise exception 'kyc submission not found or already resolved';
  end if;
end;
$$;

grant execute on function public.user_has_approved_payout_kyc(uuid) to authenticated;
grant execute on function public.submit_payout_kyc(text, text, text) to authenticated;
grant execute on function public.resolve_payout_kyc(uuid, text, text) to authenticated;

-- Require approved payout KYC before any withdrawal request.
create or replace function public.request_clash_coin_withdrawal(
  p_amount_cents integer,
  p_payment_method text,
  p_payment_details jsonb,
  p_kyc_acknowledged boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  min_withdrawal_cents constant integer := 5000;
  fraud_daily_points_threshold constant integer := 10000;
  user_row public.profiles%rowtype;
  daily_positive_points integer := 0;
  withdrawal_id uuid;
  fraud_flags jsonb := '[]'::jsonb;
  next_status text := 'pending';
  normalized_iban text;
  normalized_name text;
  normalized_email text;
  normalized_paypal_email text;
  normalized_wallet text;
  normalized_network text;
  payment_details jsonb := coalesce(p_payment_details, '{}'::jsonb);
  payment_destination text;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if not public.user_has_approved_payout_kyc(auth.uid()) then
    raise exception 'payout kyc approval required';
  end if;

  if coalesce(p_kyc_acknowledged, false) = false then
    raise exception 'kyc acknowledgement required';
  end if;

  if p_amount_cents is null or p_amount_cents < min_withdrawal_cents then
    raise exception 'minimum withdrawal is $% (% cents)', round(min_withdrawal_cents / 100.0, 2), min_withdrawal_cents;
  end if;

  if p_payment_method not in ('bank_transfer', 'paypal', 'crypto_usdt') then
    raise exception 'invalid payment method';
  end if;

  if p_payment_method = 'bank_transfer' then
    normalized_iban := upper(regexp_replace(trim(coalesce(payment_details->>'iban', '')), '\s+', '', 'g'));
    normalized_name := trim(coalesce(payment_details->>'account_holder_name', ''));
    normalized_email := lower(trim(coalesce(payment_details->>'recipient_email', '')));

    if char_length(normalized_iban) < 15 then
      raise exception 'valid iban required';
    end if;

    if char_length(normalized_name) < 2 then
      raise exception 'account holder name required';
    end if;

    if normalized_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
      raise exception 'valid recipient email required';
    end if;

    payment_details := jsonb_build_object(
      'iban', normalized_iban,
      'account_holder_name', normalized_name,
      'recipient_email', normalized_email
    );

    payment_destination := format(
      'IBAN: %s | %s | %s',
      normalized_iban,
      normalized_name,
      normalized_email
    );
  elsif p_payment_method = 'paypal' then
    normalized_paypal_email := lower(trim(coalesce(payment_details->>'paypal_email', '')));

    if normalized_paypal_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
      raise exception 'valid paypal email required';
    end if;

    payment_details := jsonb_build_object('paypal_email', normalized_paypal_email);
    payment_destination := format('PayPal: %s', normalized_paypal_email);
  else
    normalized_wallet := trim(coalesce(payment_details->>'wallet_address', ''));
    normalized_network := upper(trim(coalesce(payment_details->>'network', '')));

    if char_length(normalized_wallet) < 10 then
      raise exception 'valid usdt wallet address required';
    end if;

    if normalized_network not in ('TRC20', 'ERC20', 'BEP20') then
      raise exception 'valid usdt network required';
    end if;

    payment_details := jsonb_build_object(
      'wallet_address', normalized_wallet,
      'network', normalized_network
    );
    payment_destination := format('USDT (%s): %s', normalized_network, normalized_wallet);
  end if;

  select * into user_row
  from public.profiles
  where id = auth.uid()
  for update;

  if not found then
    raise exception 'profile not found';
  end if;

  if coalesce(user_row.is_banned, false) then
    raise exception 'account banned';
  end if;

  if coalesce(user_row.clash_coins, 0) < p_amount_cents then
    raise exception 'insufficient balance';
  end if;

  if exists (
    select 1
    from public.withdrawals
    where user_id = auth.uid()
      and status in ('pending', 'reviewing', 'fraud_blocked')
  ) then
    raise exception 'pending withdrawal already exists';
  end if;

  select coalesce(sum(amount), 0)
  into daily_positive_points
  from public.point_transactions
  where user_id = auth.uid()
    and amount > 0
    and created_at >= (now() at time zone 'utc')::date;

  if daily_positive_points >= fraud_daily_points_threshold then
    fraud_flags := fraud_flags || jsonb_build_array(
      jsonb_build_object(
        'code', 'rapid_points_gain',
        'daily_points', daily_positive_points,
        'threshold', fraud_daily_points_threshold
      )
    );
    next_status := 'fraud_blocked';
  end if;

  perform public.award_clash_coins(
    auth.uid(),
    -p_amount_cents,
    'withdrawal_hold',
    jsonb_build_object('payment_method', p_payment_method, 'usd_amount', p_amount_cents / 100.0)
  );

  insert into public.withdrawals (
    user_id,
    coin_amount,
    usd_amount,
    payment_method,
    payment_destination,
    payment_details,
    status,
    kyc_acknowledged,
    fraud_flags
  )
  values (
    auth.uid(),
    p_amount_cents,
    round(p_amount_cents / 100.0, 2),
    p_payment_method,
    payment_destination,
    payment_details,
    next_status,
    true,
    fraud_flags
  )
  returning id into withdrawal_id;

  return withdrawal_id;
end;
$$;

notify pgrst, 'reload schema';
