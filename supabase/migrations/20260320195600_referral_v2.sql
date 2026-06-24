-- Referral v2: double-sided rewards, engagement bonuses, tiers, flash events, leaderboard

alter table public.profiles
  add column if not exists referral_tier smallint not null default 0 check (referral_tier between 0 and 3);

create index if not exists profiles_referred_by_idx on public.profiles (referred_by);
create index if not exists profiles_referral_tier_idx on public.profiles (referral_tier desc, points desc);

create table if not exists public.referral_flash_events (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_ar text not null,
  title_ja text not null,
  description_en text,
  description_ar text,
  description_ja text,
  multiplier numeric(6, 2) not null default 2.0 check (multiplier > 1),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_active boolean not null default true,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint referral_flash_events_window check (ends_at > starts_at)
);

create index if not exists referral_flash_events_active_idx
  on public.referral_flash_events (is_active, starts_at, ends_at);

create table if not exists public.referral_signups (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references auth.users (id) on delete cascade,
  referred_user_id uuid not null references auth.users (id) on delete cascade,
  flash_event_id uuid references public.referral_flash_events (id) on delete set null,
  multiplier numeric(6, 2) not null default 1.0 check (multiplier >= 1),
  created_at timestamptz not null default now(),
  unique (referred_user_id)
);

create index if not exists referral_signups_referrer_created_idx
  on public.referral_signups (referrer_id, created_at desc);

create table if not exists public.referral_milestones (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references auth.users (id) on delete cascade,
  referred_user_id uuid not null references auth.users (id) on delete cascade,
  milestone text not null check (milestone in ('signup', 'first_video', 'first_battle')),
  points_awarded integer not null default 0 check (points_awarded >= 0),
  awarded_at timestamptz not null default now(),
  unique (referred_user_id, milestone)
);

create index if not exists referral_milestones_referrer_idx
  on public.referral_milestones (referrer_id, awarded_at desc);

alter table public.referral_signups enable row level security;
alter table public.referral_milestones enable row level security;
alter table public.referral_flash_events enable row level security;

drop policy if exists "Referrers can read own signups" on public.referral_signups;
create policy "Referrers can read own signups"
  on public.referral_signups for select
  using (auth.uid() = referrer_id);

drop policy if exists "Staff can read referral signups" on public.referral_signups;
create policy "Staff can read referral signups"
  on public.referral_signups for select
  using (public.is_staff());

drop policy if exists "Referrers can read own milestones" on public.referral_milestones;
create policy "Referrers can read own milestones"
  on public.referral_milestones for select
  using (auth.uid() = referrer_id);

drop policy if exists "Staff can read referral milestones" on public.referral_milestones;
create policy "Staff can read referral milestones"
  on public.referral_milestones for select
  using (public.is_staff());

drop policy if exists "Anyone can read active flash events" on public.referral_flash_events;
create policy "Anyone can read active flash events"
  on public.referral_flash_events for select
  using (true);

drop policy if exists "Admins manage flash events" on public.referral_flash_events;
create policy "Admins manage flash events"
  on public.referral_flash_events for all
  using (public.is_admin())
  with check (public.is_admin());

create or replace function public.get_active_referral_multiplier()
returns table (
  multiplier numeric,
  event_id uuid,
  title_en text,
  title_ar text,
  title_ja text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    e.multiplier,
    e.id,
    e.title_en,
    e.title_ar,
    e.title_ja
  from public.referral_flash_events e
  where e.is_active = true
    and now() >= e.starts_at
    and now() < e.ends_at
  order by e.multiplier desc, e.starts_at desc
  limit 1;
$$;

create or replace function public.referral_tier_for_count(signup_count integer)
returns smallint
language plpgsql
immutable
as $$
begin
  if signup_count >= 50 then
    return 3;
  elsif signup_count >= 20 then
    return 2;
  elsif signup_count >= 5 then
    return 1;
  end if;
  return 0;
end;
$$;

create or replace function public.sync_referral_tier(target_referrer_id uuid)
returns smallint
language plpgsql
security definer
set search_path = public
as $$
declare
  signup_count integer;
  next_tier smallint;
  old_tier smallint;
  tier_name text;
begin
  if target_referrer_id is null then
    return 0;
  end if;

  select count(*)::integer
  into signup_count
  from public.referral_signups
  where referrer_id = target_referrer_id;

  next_tier := public.referral_tier_for_count(signup_count);

  select referral_tier into old_tier
  from public.profiles
  where id = target_referrer_id;

  if coalesce(old_tier, 0) = next_tier then
    return next_tier;
  end if;

  update public.profiles
  set referral_tier = next_tier, updated_at = now()
  where id = target_referrer_id;

  if next_tier > coalesce(old_tier, 0) then
    tier_name := case next_tier
      when 1 then 'scout'
      when 2 then 'recruit'
      when 3 then 'leader'
      else 'none'
    end;

    perform public._insert_user_notification(
      target_referrer_id,
      'referral_tier_up',
      'Referral rank up',
      'You unlocked a new referral rank.',
      '/profile#referral',
      jsonb_build_object('tier', next_tier, 'tier_key', tier_name, 'signup_count', signup_count)
    );
  end if;

  return next_tier;
end;
$$;

create or replace function public.award_referral_engagement(
  p_referred_user_id uuid,
  p_milestone text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_referrer_id uuid;
  point_amount integer;
  referred_username text;
  referred_display_name text;
  milestone_label text;
begin
  if p_referred_user_id is null or p_milestone not in ('first_video', 'first_battle') then
    return false;
  end if;

  select p.referred_by into v_referrer_id
  from public.profiles p
  where p.id = p_referred_user_id;

  if v_referrer_id is null then
    return false;
  end if;

  if exists (
    select 1
    from public.referral_milestones m
    where m.referred_user_id = p_referred_user_id
      and m.milestone = p_milestone
  ) then
    return false;
  end if;

  point_amount := case p_milestone
    when 'first_video' then 200
    when 'first_battle' then 150
    else 0
  end;

  if point_amount <= 0 then
    return false;
  end if;

  insert into public.referral_milestones (referrer_id, referred_user_id, milestone, points_awarded)
  values (v_referrer_id, p_referred_user_id, p_milestone, point_amount);

  perform public.award_points(
    v_referrer_id,
    point_amount,
    'referral_' || p_milestone,
    jsonb_build_object('referred_user_id', p_referred_user_id, 'milestone', p_milestone)
  );

  select username, coalesce(display_name, username)
  into referred_username, referred_display_name
  from public.profiles
  where id = p_referred_user_id;

  milestone_label := case p_milestone
    when 'first_video' then 'uploaded their first video'
    when 'first_battle' then 'joined their first battle'
    else 'completed a milestone'
  end;

  perform public._insert_user_notification(
    v_referrer_id,
    'referral_milestone',
    'Referral milestone',
    'Your invited friend reached a new milestone.',
    '/profile#referral',
    jsonb_build_object(
      'referred_user_id', p_referred_user_id,
      'referred_username', referred_username,
      'referred_display_name', referred_display_name,
      'milestone', p_milestone,
      'milestone_label', milestone_label,
      'points', point_amount
    )
  );

  return true;
end;
$$;

create or replace function public.complete_referral_signup(
  new_user_id uuid,
  referrer_username text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  referrer_profile public.profiles%rowtype;
  flash_row record;
  multiplier numeric := 1.0;
  referrer_points integer := 100;
  invitee_points integer := 50;
  referred_display_name text;
  signup_id uuid;
begin
  if new_user_id is null or referrer_username is null then
    return false;
  end if;

  select * into referrer_profile
  from public.profiles
  where lower(username) = lower(trim(referrer_username))
  limit 1;

  if not found or referrer_profile.id = new_user_id then
    return false;
  end if;

  update public.profiles
  set referred_by = referrer_profile.id
  where id = new_user_id
    and referred_by is null;

  if not found then
    return false;
  end if;

  select * into flash_row from public.get_active_referral_multiplier() limit 1;
  if flash_row.event_id is not null then
    multiplier := flash_row.multiplier;
  end if;

  referrer_points := round(100 * multiplier)::integer;

  insert into public.referral_signups (referrer_id, referred_user_id, flash_event_id, multiplier)
  values (referrer_profile.id, new_user_id, flash_row.event_id, multiplier)
  returning id into signup_id;

  insert into public.referral_milestones (referrer_id, referred_user_id, milestone, points_awarded)
  values (referrer_profile.id, new_user_id, 'signup', referrer_points);

  perform public.award_points(
    referrer_profile.id,
    referrer_points,
    'referral_signup',
    jsonb_build_object(
      'referred_user_id', new_user_id,
      'multiplier', multiplier,
      'flash_event_id', flash_row.event_id
    )
  );

  perform public.award_points(
    new_user_id,
    invitee_points,
    'referral_welcome',
    jsonb_build_object('referrer_id', referrer_profile.id, 'referrer_username', referrer_profile.username)
  );

  perform public.sync_referral_tier(referrer_profile.id);

  select coalesce(display_name, username) into referred_display_name
  from public.profiles
  where id = new_user_id;

  perform public._insert_user_notification(
    referrer_profile.id,
    'referral_signup',
    'Friend joined via your link',
    'A friend signed up using your invite link.',
    '/profile#referral',
    jsonb_build_object(
      'referred_user_id', new_user_id,
      'referred_display_name', referred_display_name,
      'points', referrer_points,
      'multiplier', multiplier
    )
  );

  perform public._insert_user_notification(
    new_user_id,
    'referral_welcome',
    'Welcome bonus',
    'You earned bonus points for joining via an invite link.',
    '/profile#referral',
    jsonb_build_object(
      'referrer_id', referrer_profile.id,
      'referrer_username', referrer_profile.username,
      'referrer_display_name', coalesce(referrer_profile.display_name, referrer_profile.username),
      'points', invitee_points
    )
  );

  return true;
end;
$$;

create or replace function public.get_my_referral_stats()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  signup_count integer := 0;
  week_signups integer := 0;
  week_start timestamptz := date_trunc('week', now());
  milestone_video integer := 0;
  milestone_battle integer := 0;
  tier smallint := 0;
  next_tier_at integer := 5;
begin
  if uid is null then
    return '{}'::jsonb;
  end if;

  select count(*)::integer into signup_count
  from public.referral_signups
  where referrer_id = uid;

  select count(*)::integer into week_signups
  from public.referral_signups
  where referrer_id = uid
    and created_at >= week_start;

  select count(*)::integer into milestone_video
  from public.referral_milestones
  where referrer_id = uid and milestone = 'first_video';

  select count(*)::integer into milestone_battle
  from public.referral_milestones
  where referrer_id = uid and milestone = 'first_battle';

  select referral_tier into tier from public.profiles where id = uid;

  next_tier_at := case coalesce(tier, 0)
    when 0 then 5
    when 1 then 20
    when 2 then 50
    else 0
  end;

  return jsonb_build_object(
    'signup_count', signup_count,
    'week_signups', week_signups,
    'referral_tier', coalesce(tier, 0),
    'next_tier_at', next_tier_at,
    'engagement_first_video', milestone_video,
    'engagement_first_battle', milestone_battle
  );
end;
$$;

create or replace function public.get_referral_leaderboard(
  p_period text default 'week',
  p_limit integer default 10
)
returns table (
  rank bigint,
  user_id uuid,
  username text,
  display_name text,
  avatar_url text,
  referral_tier smallint,
  signup_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with counts as (
    select
      rs.referrer_id,
      count(*)::bigint as signup_count
    from public.referral_signups rs
    where case
      when p_period = 'week' then rs.created_at >= date_trunc('week', now())
      else true
    end
    group by rs.referrer_id
  )
  select
    row_number() over (order by c.signup_count desc, p.points desc) as rank,
    p.id as user_id,
    p.username,
    coalesce(p.display_name, p.username) as display_name,
    p.avatar_url,
    coalesce(p.referral_tier, 0::smallint) as referral_tier,
    c.signup_count
  from counts c
  join public.profiles p on p.id = c.referrer_id
  where p.is_banned = false
  order by c.signup_count desc, p.points desc
  limit greatest(1, least(coalesce(p_limit, 10), 50));
$$;

create or replace function public.trg_referral_first_video()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.user_id is null then
    return new;
  end if;

  if tg_op = 'INSERT' and new.moderation_status = 'approved' then
    if not exists (
      select 1 from public.videos v
      where v.user_id = new.user_id
        and v.id <> new.id
        and v.moderation_status = 'approved'
    ) then
      perform public.award_referral_engagement(new.user_id, 'first_video');
    end if;
  elsif tg_op = 'UPDATE'
    and new.moderation_status = 'approved'
    and old.moderation_status is distinct from 'approved' then
    if not exists (
      select 1 from public.videos v
      where v.user_id = new.user_id
        and v.id <> new.id
        and v.moderation_status = 'approved'
    ) then
      perform public.award_referral_engagement(new.user_id, 'first_video');
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists referral_first_video_trigger on public.videos;
create trigger referral_first_video_trigger
  after insert or update of moderation_status on public.videos
  for each row
  execute function public.trg_referral_first_video();

create or replace function public.trg_referral_first_battle()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.video_duels d
    where d.challenger_user_id = new.challenger_user_id
      and d.id <> new.id
  ) then
    perform public.award_referral_engagement(new.challenger_user_id, 'first_battle');
  end if;

  return new;
end;
$$;

drop trigger if exists referral_first_battle_trigger on public.video_duels;
create trigger referral_first_battle_trigger
  after insert on public.video_duels
  for each row
  execute function public.trg_referral_first_battle();

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

  return new;
end;
$$;

grant execute on function public.get_active_referral_multiplier() to anon, authenticated, service_role;
grant execute on function public.get_my_referral_stats() to authenticated, service_role;
grant execute on function public.get_referral_leaderboard(text, integer) to anon, authenticated, service_role;
grant execute on function public.sync_referral_tier(uuid) to service_role;
grant execute on function public.award_referral_engagement(uuid, text) to service_role;

-- Backfill referral_tier for existing referrers
do $$
declare
  r record;
begin
  for r in
    select referrer_id, count(*)::integer as signup_count
    from public.referral_signups
    group by referrer_id
  loop
    update public.profiles
    set referral_tier = public.referral_tier_for_count(r.signup_count)
    where id = r.referrer_id;
  end loop;
end;
$$;

-- Backfill referral_signups from existing referred_by links
insert into public.referral_signups (referrer_id, referred_user_id, multiplier)
select p.referred_by, p.id, 1.0
from public.profiles p
where p.referred_by is not null
on conflict (referred_user_id) do nothing;

do $$
declare
  r record;
begin
  for r in
    select referrer_id, count(*)::integer as signup_count
    from public.referral_signups
    group by referrer_id
  loop
    update public.profiles
    set referral_tier = public.referral_tier_for_count(r.signup_count)
    where id = r.referrer_id;
  end loop;
end;
$$;
