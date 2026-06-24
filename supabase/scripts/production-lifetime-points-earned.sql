-- Lifetime hunter points earned (sum of all positive awards, never decreases on spend).

alter table public.profiles
  add column if not exists lifetime_points_earned integer not null default 0 check (lifetime_points_earned >= 0);

create index if not exists profiles_lifetime_points_earned_idx
  on public.profiles (lifetime_points_earned desc);

create or replace function public.award_points(
  target_user_id uuid,
  point_amount integer,
  point_reason text,
  point_metadata jsonb default '{}'::jsonb
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  next_points integer;
  next_level smallint;
begin
  if target_user_id is null or point_amount = 0 then
    return 0;
  end if;

  update public.profiles
  set
    points = points + point_amount,
    lifetime_points_earned = lifetime_points_earned + case when point_amount > 0 then point_amount else 0 end,
    updated_at = now()
  where id = target_user_id
  returning points into next_points;

  if not found then
    return 0;
  end if;

  next_level := public.points_to_level(next_points);

  update public.profiles
  set
    level = next_level,
    is_verified = case when next_level >= 4 then true else is_verified end,
    updated_at = now()
  where id = target_user_id;

  insert into public.point_transactions (user_id, amount, reason, metadata)
  values (target_user_id, point_amount, point_reason, coalesce(point_metadata, '{}'::jsonb));

  return next_points;
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

  if new.referral_tier is distinct from old.referral_tier then
    new.referral_tier := old.referral_tier;
  end if;

  if new.lifetime_points_earned is distinct from old.lifetime_points_earned then
    new.lifetime_points_earned := old.lifetime_points_earned;
  end if;

  return new;
end;
$$;

update public.profiles p
set lifetime_points_earned = coalesce(
  (
    select sum(pt.amount)::integer
    from public.point_transactions pt
    where pt.user_id = p.id
      and pt.amount > 0
  ),
  0
);
