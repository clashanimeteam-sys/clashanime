-- ClashCoins wallet, coin ledger, and withdrawal requests

alter table public.profiles
  add column if not exists clash_coins integer not null default 0 check (clash_coins >= 0);

create index if not exists profiles_clash_coins_idx on public.profiles (clash_coins desc);

create table if not exists public.coin_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  amount integer not null,
  reason text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists coin_transactions_user_idx
  on public.coin_transactions (user_id, created_at desc);

alter table public.coin_transactions enable row level security;

drop policy if exists "Users can read own coin transactions" on public.coin_transactions;
create policy "Users can read own coin transactions"
  on public.coin_transactions for select
  using (auth.uid() = user_id);

drop policy if exists "Staff can read all coin transactions" on public.coin_transactions;
create policy "Staff can read all coin transactions"
  on public.coin_transactions for select
  using (public.is_staff());

create table if not exists public.withdrawals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  coin_amount integer not null check (coin_amount > 0),
  usd_amount numeric(10, 2) not null check (usd_amount > 0),
  payment_method text not null
    check (payment_method in ('paypal', 'wise', 'revolut', 'crypto_usdt', 'crypto_btc')),
  payment_destination text not null check (char_length(trim(payment_destination)) between 3 and 500),
  status text not null default 'pending'
    check (status in ('pending', 'reviewing', 'completed', 'rejected', 'fraud_blocked')),
  kyc_acknowledged boolean not null default false,
  fraud_flags jsonb not null default '[]'::jsonb,
  admin_notes text,
  reviewed_by uuid references auth.users (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists withdrawals_user_idx on public.withdrawals (user_id, created_at desc);
create index if not exists withdrawals_status_idx on public.withdrawals (status, created_at desc);

alter table public.withdrawals enable row level security;

drop policy if exists "Users can read own withdrawals" on public.withdrawals;
create policy "Users can read own withdrawals"
  on public.withdrawals for select
  using (auth.uid() = user_id);

drop policy if exists "Staff can read all withdrawals" on public.withdrawals;
create policy "Staff can read all withdrawals"
  on public.withdrawals for select
  using (public.is_staff());

drop policy if exists "Staff can update withdrawals" on public.withdrawals;
create policy "Staff can update withdrawals"
  on public.withdrawals for update
  using (public.is_staff());

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
  points_per_coin constant integer := 1000;
  user_points integer;
  coins_to_add integer;
  next_points integer;
  next_coins integer;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if point_amount is null or point_amount < points_per_coin then
    raise exception 'minimum conversion is % points per coin', points_per_coin;
  end if;

  if point_amount % points_per_coin <> 0 then
    raise exception 'amount must be a multiple of %', points_per_coin;
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

  coins_to_add := point_amount / points_per_coin;

  next_points := public.award_points(auth.uid(), -point_amount, 'clash_coin_conversion', jsonb_build_object('coins_added', coins_to_add));
  next_coins := public.award_clash_coins(auth.uid(), coins_to_add, 'points_conversion', jsonb_build_object('points_spent', point_amount));

  return jsonb_build_object(
    'points_spent', point_amount,
    'coins_added', coins_to_add,
    'points_balance', next_points,
    'clash_coins_balance', next_coins
  );
end;
$$;

create or replace function public.request_clash_coin_withdrawal(
  p_coin_amount integer,
  p_payment_method text,
  p_payment_destination text,
  p_kyc_acknowledged boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  min_withdrawal_coins constant integer := 50;
  fraud_daily_points_threshold constant integer := 10000;
  user_row public.profiles%rowtype;
  daily_positive_points integer := 0;
  withdrawal_id uuid;
  fraud_flags jsonb := '[]'::jsonb;
  next_status text := 'pending';
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if p_coin_amount is null or p_coin_amount < min_withdrawal_coins then
    raise exception 'minimum withdrawal is % clash coins ($%)', min_withdrawal_coins, min_withdrawal_coins;
  end if;

  if p_payment_method not in ('paypal', 'wise', 'revolut', 'crypto_usdt', 'crypto_btc') then
    raise exception 'invalid payment method';
  end if;

  if p_payment_destination is null or char_length(trim(p_payment_destination)) < 3 then
    raise exception 'payment destination required';
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

  if coalesce(user_row.clash_coins, 0) < p_coin_amount then
    raise exception 'insufficient clash coins';
  end if;

  if exists (
    select 1
    from public.withdrawals
    where user_id = auth.uid()
      and status in ('pending', 'reviewing')
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
    -p_coin_amount,
    'withdrawal_hold',
    jsonb_build_object('payment_method', p_payment_method)
  );

  insert into public.withdrawals (
    user_id,
    coin_amount,
    usd_amount,
    payment_method,
    payment_destination,
    status,
    kyc_acknowledged,
    fraud_flags
  )
  values (
    auth.uid(),
    p_coin_amount,
    p_coin_amount::numeric,
    p_payment_method,
    trim(p_payment_destination),
    next_status,
    true,
    fraud_flags
  )
  returning id into withdrawal_id;

  return withdrawal_id;
end;
$$;

create or replace function public.resolve_clash_coin_withdrawal(
  p_withdrawal_id uuid,
  p_status text,
  p_admin_notes text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  withdrawal_row public.withdrawals%rowtype;
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  if p_status not in ('completed', 'rejected', 'reviewing') then
    raise exception 'invalid status';
  end if;

  select * into withdrawal_row
  from public.withdrawals
  where id = p_withdrawal_id
  for update;

  if not found then
    raise exception 'withdrawal not found';
  end if;

  if withdrawal_row.status in ('completed', 'rejected') then
    raise exception 'withdrawal already resolved';
  end if;

  if p_status = 'rejected' then
    perform public.award_clash_coins(
      withdrawal_row.user_id,
      withdrawal_row.coin_amount,
      'withdrawal_refund',
      jsonb_build_object('withdrawal_id', p_withdrawal_id)
    );
  end if;

  update public.withdrawals
  set
    status = p_status,
    admin_notes = nullif(trim(p_admin_notes), ''),
    reviewed_by = auth.uid(),
    reviewed_at = now(),
    updated_at = now()
  where id = p_withdrawal_id;

  return true;
end;
$$;

create or replace function public.guard_profile_privileged_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if current_user in ('postgres', 'supabase_admin')
    or coalesce(auth.jwt()->>'role', '') = 'service_role' then
    return new;
  end if;

  if new.role is distinct from old.role and not public.is_admin() then
    new.role := old.role;
  end if;

  if new.is_banned is distinct from old.is_banned and not public.is_admin() then
    new.is_banned := old.is_banned;
  end if;

  if new.is_verified is distinct from old.is_verified and not public.is_admin() then
    new.is_verified := old.is_verified;
  end if;

  if new.points is distinct from old.points then
    new.points := old.points;
  end if;

  if new.level is distinct from old.level then
    new.level := old.level;
  end if;

  if new.referred_by is distinct from old.referred_by then
    new.referred_by := old.referred_by;
  end if;

  if new.clash_coins is distinct from old.clash_coins then
    new.clash_coins := old.clash_coins;
  end if;

  return new;
end;
$$;

grant execute on function public.award_clash_coins(uuid, integer, text, jsonb) to service_role;
grant execute on function public.convert_points_to_clash_coins(integer) to authenticated;
grant execute on function public.request_clash_coin_withdrawal(integer, text, text, boolean) to authenticated;
grant execute on function public.resolve_clash_coin_withdrawal(uuid, text, text) to authenticated;

notify pgrst, 'reload schema';
