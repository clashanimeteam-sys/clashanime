-- Hunter rank system v2:
-- Newbie 0-999 | Explorer 1000-2999 | Duelist 3000-5999 | Master 6000-9999 | Clash Master 10000+

alter table public.profiles
  drop constraint if exists profiles_level_check;

alter table public.profiles
  add constraint profiles_level_check check (level between 1 and 5);

create or replace function public.points_to_level(target_points integer)
returns smallint
language plpgsql
immutable
as $$
begin
  if target_points >= 10000 then
    return 5;
  elsif target_points >= 6000 then
    return 4;
  elsif target_points >= 3000 then
    return 3;
  elsif target_points >= 1000 then
    return 2;
  end if;

  return 1;
end;
$$;

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
  previous_level smallint;
  already_verified boolean;
begin
  if target_user_id is null or point_amount = 0 then
    return 0;
  end if;

  select level, is_verified
  into previous_level, already_verified
  from public.profiles
  where id = target_user_id;

  if not found then
    return 0;
  end if;

  update public.profiles
  set
    points = points + point_amount,
    lifetime_points_earned = lifetime_points_earned + case when point_amount > 0 then point_amount else 0 end,
    updated_at = now()
  where id = target_user_id
  returning points into next_points;

  next_level := public.points_to_level(next_points);

  update public.profiles
  set
    level = next_level,
    updated_at = now()
  where id = target_user_id;

  if next_level >= 5
    and coalesce(previous_level, 1) < 5
    and not coalesce(already_verified, false)
    and not exists (
      select 1
      from public.verification_requests
      where user_id = target_user_id
        and status = 'pending'
    ) then
    insert into public.verification_requests (user_id, message)
    values (
      target_user_id,
      'Clash Master rank reached (10,000+ points). Verification review required.'
    );
  end if;

  insert into public.point_transactions (user_id, amount, reason, metadata)
  values (target_user_id, point_amount, point_reason, coalesce(point_metadata, '{}'::jsonb));

  return next_points;
end;
$$;

create or replace function public.request_channel_verification(request_message text default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  request_id uuid;
  user_level smallint;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  select public.points_to_level(points)
  into user_level
  from public.profiles
  where id = auth.uid();

  if coalesce(user_level, 1) < 5 then
    raise exception 'clash master rank required';
  end if;

  if exists (
    select 1 from public.profiles
    where id = auth.uid() and is_verified = true
  ) then
    raise exception 'already verified';
  end if;

  if exists (
    select 1 from public.verification_requests
    where user_id = auth.uid() and status = 'pending'
  ) then
    raise exception 'request already pending';
  end if;

  insert into public.verification_requests (user_id, message)
  values (auth.uid(), nullif(trim(request_message), ''))
  returning id into request_id;

  return request_id;
end;
$$;

update public.profiles
set level = public.points_to_level(coalesce(points, 0))
where true;

-- Queue verification for existing Clash Master users who are not verified yet.
insert into public.verification_requests (user_id, message)
select
  p.id,
  'Clash Master rank reached (10,000+ points). Verification review required.'
from public.profiles p
where public.points_to_level(coalesce(p.points, 0)) >= 5
  and coalesce(p.is_verified, false) = false
  and not exists (
    select 1
    from public.verification_requests vr
    where vr.user_id = p.id
      and vr.status = 'pending'
  );

grant execute on function public.points_to_level(integer) to anon, authenticated;
grant execute on function public.request_channel_verification(text) to authenticated;
