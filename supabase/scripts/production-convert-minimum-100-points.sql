-- Allow converting from 100 points ($0.10) in 100-point steps.

create or replace function public.convert_points_to_clash_coins(point_amount integer)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  points_per_dollar constant integer := 1000;
  cents_per_dollar constant integer := 100;
  min_conversion_points constant integer := 100;
  conversion_points_step constant integer := 100;
  user_points integer;
  cents_to_add integer;
  next_points integer;
  next_balance_cents integer;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if point_amount is null or point_amount < min_conversion_points then
    raise exception 'minimum conversion is % points ($0.10)', min_conversion_points;
  end if;

  if point_amount % conversion_points_step <> 0 then
    raise exception 'amount must be a multiple of %', conversion_points_step;
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

notify pgrst, 'reload schema';
