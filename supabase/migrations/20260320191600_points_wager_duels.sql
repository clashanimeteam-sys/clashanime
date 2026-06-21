-- Points wager duels: stake hunter points, invite an opponent, winner takes the pot

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
