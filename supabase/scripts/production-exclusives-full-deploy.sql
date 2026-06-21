-- Run once in Supabase SQL Editor (production: doqiuduigbdoczdzsima)
-- https://supabase.com/dashboard/project/doqiuduigbdoczdzsima/sql/new
-- Safe to re-run. Combines Exclusives arena: daily hall, clip duels, points wagers, username search.

-- ===== production-daily-hall-duel.sql =====

create or replace function public.get_daily_interaction_leader()
returns table (
  user_id uuid,
  username text,
  display_name text,
  avatar_url text,
  points_today bigint,
  level smallint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.id,
    p.username,
    p.display_name,
    p.avatar_url,
    coalesce(sum(pt.amount), 0)::bigint as points_today,
    p.level
  from public.point_transactions pt
  join public.profiles p on p.id = pt.user_id
  where pt.created_at >= date_trunc('day', timezone('utc', now()))
    and pt.amount > 0
    and coalesce(p.is_banned, false) = false
  group by p.id, p.username, p.display_name, p.avatar_url, p.level
  having coalesce(sum(pt.amount), 0) > 0
  order by points_today desc
  limit 1;
$$;

grant execute on function public.get_daily_interaction_leader() to anon, authenticated, service_role;

-- ===== production-video-duels.sql =====

create table if not exists public.video_duels (
  id uuid primary key default gen_random_uuid(),
  challenged_video_id uuid not null references public.videos (id) on delete cascade,
  challenger_video_id uuid not null references public.videos (id) on delete cascade,
  challenger_user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint video_duels_distinct_videos check (challenged_video_id <> challenger_video_id)
);

create index if not exists video_duels_created_at_idx on public.video_duels (created_at desc);
create index if not exists video_duels_challenged_idx on public.video_duels (challenged_video_id);
create index if not exists video_duels_challenger_user_idx on public.video_duels (challenger_user_id);

alter table public.video_duels enable row level security;

drop policy if exists "Anyone can read video duels" on public.video_duels;

create policy "Anyone can read video duels"
  on public.video_duels for select
  using (true);

create or replace function public.create_video_duel(
  p_challenged_video_id uuid,
  p_challenger_video_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  challenger_id uuid := auth.uid();
  challenged_row public.videos%rowtype;
  challenger_row public.videos%rowtype;
  duel_id uuid;
begin
  if challenger_id is null then
    raise exception 'not authenticated';
  end if;

  if p_challenged_video_id is null or p_challenger_video_id is null then
    raise exception 'missing video ids';
  end if;

  if p_challenged_video_id = p_challenger_video_id then
    raise exception 'videos must differ';
  end if;

  select * into challenged_row
  from public.videos
  where id = p_challenged_video_id
    and moderation_status = 'approved';

  if not found then
    raise exception 'challenged video unavailable';
  end if;

  if challenged_row.user_id = challenger_id then
    raise exception 'cannot challenge own video';
  end if;

  select * into challenger_row
  from public.videos
  where id = p_challenger_video_id
    and user_id = challenger_id
    and moderation_status = 'approved';

  if not found then
    raise exception 'challenger video unavailable';
  end if;

  insert into public.video_duels (
    challenged_video_id,
    challenger_video_id,
    challenger_user_id
  )
  values (
    p_challenged_video_id,
    p_challenger_video_id,
    challenger_id
  )
  returning id into duel_id;

  perform public.award_points(challenger_id, 10, 'video_duel_challenge', jsonb_build_object(
    'duel_id', duel_id,
    'challenged_video_id', p_challenged_video_id,
    'challenger_video_id', p_challenger_video_id
  ));

  return duel_id;
end;
$$;

grant execute on function public.create_video_duel(uuid, uuid) to authenticated, service_role;

-- ===== production-points-wager-duels.sql =====


create table if not exists public.points_wager_duels (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users (id) on delete cascade,
  opponent_id uuid references auth.users (id) on delete set null,
  opponent_username text not null,
  creator_video_id uuid not null references public.videos (id) on delete cascade,
  opponent_video_id uuid references public.videos (id) on delete set null,
  wager_points integer not null check (wager_points >= 10),
  status text not null default 'pending'
    check (status in ('pending', 'active', 'completed', 'cancelled')),
  winner_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  resolved_at timestamptz,
  constraint points_wager_duels_distinct_videos check (
    opponent_video_id is null or creator_video_id <> opponent_video_id
  )
);

create index if not exists points_wager_duels_status_idx on public.points_wager_duels (status, created_at desc);
create index if not exists points_wager_duels_creator_idx on public.points_wager_duels (creator_id);
create index if not exists points_wager_duels_opponent_idx on public.points_wager_duels (opponent_id);
create index if not exists points_wager_duels_opponent_username_idx on public.points_wager_duels (lower(opponent_username));

alter table public.points_wager_duels enable row level security;

drop policy if exists "Anyone can read points wager duels" on public.points_wager_duels;

create policy "Anyone can read points wager duels"
  on public.points_wager_duels for select
  using (true);

create or replace function public.create_points_wager_duel(
  p_opponent_username text,
  p_creator_video_id uuid,
  p_wager_points integer
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  creator_id uuid := auth.uid();
  opponent_row public.profiles%rowtype;
  creator_video public.videos%rowtype;
  creator_points integer;
  duel_id uuid;
begin
  if creator_id is null then
    raise exception 'not authenticated';
  end if;

  if p_opponent_username is null or trim(p_opponent_username) = '' then
    raise exception 'opponent username required';
  end if;

  if p_wager_points is null or p_wager_points < 10 then
    raise exception 'minimum wager is 10 points';
  end if;

  select * into opponent_row
  from public.profiles
  where lower(username) = lower(trim(p_opponent_username))
  limit 1;

  if not found then
    raise exception 'opponent not found';
  end if;

  if opponent_row.id = creator_id then
    raise exception 'cannot challenge yourself';
  end if;

  if coalesce(opponent_row.is_banned, false) then
    raise exception 'opponent unavailable';
  end if;

  select * into creator_video
  from public.videos
  where id = p_creator_video_id
    and user_id = creator_id
    and moderation_status = 'approved';

  if not found then
    raise exception 'creator video unavailable';
  end if;

  select points into creator_points
  from public.profiles
  where id = creator_id;

  if coalesce(creator_points, 0) < p_wager_points then
    raise exception 'insufficient points';
  end if;

  perform public.award_points(
    creator_id,
    -p_wager_points,
    'points_duel_stake',
    jsonb_build_object('role', 'creator')
  );

  insert into public.points_wager_duels (
    creator_id,
    opponent_id,
    opponent_username,
    creator_video_id,
    wager_points,
    status
  )
  values (
    creator_id,
    opponent_row.id,
    opponent_row.username,
    p_creator_video_id,
    p_wager_points,
    'pending'
  )
  returning id into duel_id;

  return duel_id;
end;
$$;

create or replace function public.accept_points_wager_duel(
  p_duel_id uuid,
  p_opponent_video_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  accepter_id uuid := auth.uid();
  duel_row public.points_wager_duels%rowtype;
  opponent_video public.videos%rowtype;
  opponent_points integer;
begin
  if accepter_id is null then
    raise exception 'not authenticated';
  end if;

  select * into duel_row
  from public.points_wager_duels
  where id = p_duel_id
  for update;

  if not found then
    raise exception 'duel not found';
  end if;

  if duel_row.status <> 'pending' then
    raise exception 'duel not pending';
  end if;

  if duel_row.opponent_id <> accepter_id then
    raise exception 'not invited to this duel';
  end if;

  select * into opponent_video
  from public.videos
  where id = p_opponent_video_id
    and user_id = accepter_id
    and moderation_status = 'approved';

  if not found then
    raise exception 'opponent video unavailable';
  end if;

  if opponent_video.id = duel_row.creator_video_id then
    raise exception 'videos must differ';
  end if;

  select points into opponent_points
  from public.profiles
  where id = accepter_id;

  if coalesce(opponent_points, 0) < duel_row.wager_points then
    raise exception 'insufficient points';
  end if;

  perform public.award_points(
    accepter_id,
    -duel_row.wager_points,
    'points_duel_stake',
    jsonb_build_object('duel_id', p_duel_id, 'role', 'opponent')
  );

  update public.points_wager_duels
  set
    opponent_video_id = p_opponent_video_id,
    status = 'active',
    accepted_at = now()
  where id = p_duel_id;

  return p_duel_id;
end;
$$;

create or replace function public.resolve_points_wager_duel(p_duel_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_id uuid := auth.uid();
  duel_row public.points_wager_duels%rowtype;
  creator_likes integer;
  opponent_likes integer;
  winner uuid;
  pot integer;
begin
  if caller_id is null then
    raise exception 'not authenticated';
  end if;

  select * into duel_row
  from public.points_wager_duels
  where id = p_duel_id
  for update;

  if not found then
    raise exception 'duel not found';
  end if;

  if duel_row.status <> 'active' then
    raise exception 'duel not active';
  end if;

  if caller_id not in (duel_row.creator_id, duel_row.opponent_id) then
    raise exception 'not a duel participant';
  end if;

  select likes_count into creator_likes
  from public.videos
  where id = duel_row.creator_video_id;

  select likes_count into opponent_likes
  from public.videos
  where id = duel_row.opponent_video_id;

  creator_likes := coalesce(creator_likes, 0);
  opponent_likes := coalesce(opponent_likes, 0);

  if creator_likes = opponent_likes then
    perform public.award_points(
      duel_row.creator_id,
      duel_row.wager_points,
      'points_duel_refund',
      jsonb_build_object('duel_id', p_duel_id, 'reason', 'tie')
    );
    perform public.award_points(
      duel_row.opponent_id,
      duel_row.wager_points,
      'points_duel_refund',
      jsonb_build_object('duel_id', p_duel_id, 'reason', 'tie')
    );

    update public.points_wager_duels
    set status = 'completed', resolved_at = now()
    where id = p_duel_id;

    return p_duel_id;
  end if;

  if creator_likes > opponent_likes then
    winner := duel_row.creator_id;
  else
    winner := duel_row.opponent_id;
  end if;

  pot := duel_row.wager_points * 2;

  perform public.award_points(
    winner,
    pot,
    'points_duel_win',
    jsonb_build_object('duel_id', p_duel_id, 'pot', pot)
  );

  update public.points_wager_duels
  set
    status = 'completed',
    winner_id = winner,
    resolved_at = now()
  where id = p_duel_id;

  return p_duel_id;
end;
$$;

create or replace function public.cancel_points_wager_duel(p_duel_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_id uuid := auth.uid();
  duel_row public.points_wager_duels%rowtype;
begin
  if caller_id is null then
    raise exception 'not authenticated';
  end if;

  select * into duel_row
  from public.points_wager_duels
  where id = p_duel_id
  for update;

  if not found then
    raise exception 'duel not found';
  end if;

  if duel_row.status <> 'pending' then
    raise exception 'duel not pending';
  end if;

  if duel_row.creator_id <> caller_id then
    raise exception 'only creator can cancel';
  end if;

  perform public.award_points(
    duel_row.creator_id,
    duel_row.wager_points,
    'points_duel_refund',
    jsonb_build_object('duel_id', p_duel_id, 'reason', 'cancelled')
  );

  update public.points_wager_duels
  set status = 'cancelled', resolved_at = now()
  where id = p_duel_id;

  return p_duel_id;
end;
$$;

grant execute on function public.create_points_wager_duel(text, uuid, integer) to authenticated, service_role;
grant execute on function public.accept_points_wager_duel(uuid, uuid) to authenticated, service_role;
grant execute on function public.resolve_points_wager_duel(uuid) to authenticated, service_role;
grant execute on function public.cancel_points_wager_duel(uuid) to authenticated, service_role;

-- ===== production-profile-username-search.sql =====

create or replace function public.search_profile_usernames(
  p_query text,
  p_exclude_user_id uuid default null,
  p_limit integer default 8
)
returns table (
  id uuid,
  username text,
  display_name text,
  avatar_url text,
  is_verified boolean
)
language sql
stable
security definer
set search_path = public
as $$
  with cleaned as (
    select nullif(trim(both '@' from coalesce(p_query, '')), '') as term
  )
  select
    p.id,
    p.username,
    p.display_name,
    p.avatar_url,
    p.is_verified
  from public.profiles p
  cross join cleaned c
  where c.term is not null
    and coalesce(p.is_banned, false) = false
    and (p_exclude_user_id is null or p.id <> p_exclude_user_id)
    and (
      p.username ilike c.term || '%'
      or coalesce(p.display_name, '') ilike '%' || c.term || '%'
    )
  order by
    case when p.username ilike c.term || '%' then 0 else 1 end,
    p.username asc
  limit greatest(1, least(coalesce(p_limit, 8), 20));
$$;

grant execute on function public.search_profile_usernames(text, uuid, integer) to anon, authenticated, service_role;

