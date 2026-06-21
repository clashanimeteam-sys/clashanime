-- Store ClashCoins balance in USD cents, bank transfer payouts only.

-- Existing whole-dollar balances become cents ($1 -> 100 cents).
update public.profiles
set clash_coins = clash_coins * 100
where clash_coins > 0 and clash_coins < 1000000;

update public.coin_transactions
set amount = amount * 100
where reason in ('points_conversion', 'withdrawal_hold', 'withdrawal_refund')
  and abs(amount) > 0
  and abs(amount) < 1000000;

update public.withdrawals
set
  coin_amount = coin_amount * 100,
  usd_amount = coin_amount * 100 / 100.0
where coin_amount > 0 and coin_amount < 1000000;

alter table public.withdrawals
  add column if not exists payment_details jsonb not null default '{}'::jsonb;

alter table public.withdrawals drop constraint if exists withdrawals_payment_method_check;

update public.withdrawals
set payment_method = 'bank_transfer'
where payment_method is distinct from 'bank_transfer';

alter table public.withdrawals
  add constraint withdrawals_payment_method_check
  check (payment_method in ('bank_transfer'));

create or replace function public.award_clash_coins(
  target_user_id uuid,
  coin_amount integer,
  coin_reason text,
  coin_metadata jsonb default '{}'::jsonb
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  next_balance integer;
begin
  if target_user_id is null or coin_amount = 0 then
    return 0;
  end if;

  update public.profiles
  set
    clash_coins = clash_coins + coin_amount,
    updated_at = now()
  where id = target_user_id
  returning clash_coins into next_balance;

  if not found then
    return 0;
  end if;

  if next_balance < 0 then
    raise exception 'insufficient clash coins';
  end if;

  insert into public.coin_transactions (user_id, amount, reason, metadata)
  values (target_user_id, coin_amount, coin_reason, coin_metadata);

  return next_balance;
end;
$$;

create or replace function public.convert_points_to_clash_coins(point_amount integer)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  points_per_dollar constant integer := 1000;
  cents_per_dollar constant integer := 100;
  user_points integer;
  cents_to_add integer;
  next_points integer;
  next_balance_cents integer;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if point_amount is null or point_amount < points_per_dollar then
    raise exception 'minimum conversion is % points ($1)', points_per_dollar;
  end if;

  if point_amount % points_per_dollar <> 0 then
    raise exception 'amount must be a multiple of %', points_per_dollar;
  end if;

  select points into user_points
  from public.profiles
  where id = auth.uid()
  for update;

  if not found then
    raise exception 'profile not found';
  end if;

  if user_points < point_amount then
    raise exception 'insufficient points';
  end if;

  cents_to_add := (point_amount * cents_per_dollar) / points_per_dollar;

  next_points := public.award_points(
    auth.uid(),
    -point_amount,
    'clash_coin_conversion',
    jsonb_build_object('cents_added', cents_to_add, 'usd_added', cents_to_add / 100.0)
  );
  next_balance_cents := public.award_clash_coins(
    auth.uid(),
    cents_to_add,
    'points_conversion',
    jsonb_build_object('points_spent', point_amount, 'usd_added', cents_to_add / 100.0)
  );

  return jsonb_build_object(
    'points_spent', point_amount,
    'cents_added', cents_to_add,
    'usd_added', round(cents_to_add / 100.0, 2),
    'points_balance', next_points,
    'balance_cents', next_balance_cents,
    'balance_usd', round(next_balance_cents / 100.0, 2)
  );
end;
$$;

create or replace function public.request_clash_coin_withdrawal(
  p_amount_cents integer,
  p_iban text,
  p_account_holder_name text,
  p_recipient_email text,
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
  payment_details jsonb;
  payment_destination text;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if p_amount_cents is null or p_amount_cents < min_withdrawal_cents then
    raise exception 'minimum withdrawal is $% (% cents)', round(min_withdrawal_cents / 100.0, 2), min_withdrawal_cents;
  end if;

  normalized_iban := upper(regexp_replace(trim(coalesce(p_iban, '')), '\s+', '', 'g'));
  normalized_name := trim(coalesce(p_account_holder_name, ''));
  normalized_email := lower(trim(coalesce(p_recipient_email, '')));

  if char_length(normalized_iban) < 15 then
    raise exception 'valid iban required';
  end if;

  if char_length(normalized_name) < 2 then
    raise exception 'account holder name required';
  end if;

  if normalized_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'valid recipient email required';
  end if;

  if coalesce(p_kyc_acknowledged, false) = false then
    raise exception 'kyc acknowledgement required';
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

  perform public.award_clash_coins(
    auth.uid(),
    -p_amount_cents,
    'withdrawal_hold',
    jsonb_build_object('payment_method', 'bank_transfer', 'usd_amount', p_amount_cents / 100.0)
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
    'bank_transfer',
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
