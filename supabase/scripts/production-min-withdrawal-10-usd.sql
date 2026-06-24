-- Production: lower minimum ClashCoin withdrawal from $50 to $10.

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
  min_withdrawal_cents constant integer := 1000;
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
