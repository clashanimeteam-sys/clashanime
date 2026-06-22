-- Run manually in Supabase SQL Editor (production)

-- In-app notification events: follows, channel activity, duels, seasons

alter table public.user_notifications
  add column if not exists metadata jsonb not null default '{}'::jsonb;

create index if not exists user_notifications_type_idx
  on public.user_notifications (type, created_at desc);

create or replace function public._user_in_app_notifications_enabled(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select p.in_app_enabled
      from public.user_notification_preferences p
      where p.user_id = p_user_id
    ),
    true
  );
$$;

create or replace function public._insert_user_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_body text,
  p_link text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if p_user_id is null then
    return null;
  end if;

  if not public._user_in_app_notifications_enabled(p_user_id) then
    return null;
  end if;

  insert into public.user_notifications (user_id, type, title, body, link, metadata)
  values (
    p_user_id,
    p_type,
    p_title,
    p_body,
    p_link,
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_id;

  return v_id;
end;
$$;

create or replace function public._notify_channel_followers(
  p_channel_id uuid,
  p_type text,
  p_title text,
  p_body text,
  p_link text,
  p_metadata jsonb default '{}'::jsonb,
  p_exclude_user_id uuid default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer := 0;
  r record;
begin
  for r in
    select cf.follower_id
    from public.channel_follows cf
    where cf.following_id = p_channel_id
      and (p_exclude_user_id is null or cf.follower_id <> p_exclude_user_id)
  loop
    perform public._insert_user_notification(
      r.follower_id,
      p_type,
      p_title,
      p_body,
      p_link,
      p_metadata
    );
    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;

create or replace function public._notify_all_users(
  p_type text,
  p_title text,
  p_body text,
  p_link text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  insert into public.user_notifications (user_id, type, title, body, link, metadata)
  select
    u.id,
    p_type,
    p_title,
    p_body,
    p_link,
    coalesce(p_metadata, '{}'::jsonb)
  from auth.users u
  left join public.user_notification_preferences p on p.user_id = u.id
  where coalesce(p.in_app_enabled, true) = true;

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

create or replace function public.trg_notify_new_follower()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_follower public.profiles%rowtype;
  v_name text;
begin
  select * into v_follower from public.profiles where id = new.follower_id;
  v_name := coalesce(nullif(trim(v_follower.display_name), ''), v_follower.username, 'Someone');

  perform public._insert_user_notification(
    new.following_id,
    'follow',
    'New follower',
    v_name || ' started following you',
    case
      when v_follower.username is not null then '/channel/' || v_follower.username
      else null
    end,
    jsonb_build_object(
      'actor_username', v_follower.username,
      'actor_display_name', v_name
    )
  );

  return new;
end;
$$;

drop trigger if exists channel_follows_notify_followed on public.channel_follows;

create trigger channel_follows_notify_followed
  after insert on public.channel_follows
  for each row
  execute function public.trg_notify_new_follower();

create or replace function public.trg_notify_video_approved()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_channel public.profiles%rowtype;
  v_name text;
begin
  if new.moderation_status = 'approved'
     and new.user_id is not null
     and (
       tg_op = 'INSERT'
       or old.moderation_status is distinct from 'approved'
     ) then
    select * into v_channel from public.profiles where id = new.user_id;
    v_name := coalesce(nullif(trim(v_channel.display_name), ''), v_channel.username, 'A channel');

    perform public._notify_channel_followers(
      new.user_id,
      'new_video',
      'New video',
      v_name || ' published: ' || left(new.title, 120),
      '/video/' || new.id::text,
      jsonb_build_object(
        'channel_username', v_channel.username,
        'channel_display_name', v_name,
        'video_title', new.title,
        'video_id', new.id
      ),
      new.user_id
    );
  end if;

  return new;
end;
$$;

drop trigger if exists videos_notify_followers_on_approve on public.videos;

create trigger videos_notify_followers_on_approve
  after insert or update of moderation_status on public.videos
  for each row
  execute function public.trg_notify_video_approved();

create or replace function public.trg_notify_beats_track_approved()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_channel public.profiles%rowtype;
  v_name text;
begin
  if new.status = 'approved'
     and new.submitter_id is not null
     and (
       tg_op = 'INSERT'
       or old.status is distinct from 'approved'
     ) then
    select * into v_channel from public.profiles where id = new.submitter_id;
    v_name := coalesce(nullif(trim(v_channel.display_name), ''), v_channel.username, 'A channel');

    perform public._notify_channel_followers(
      new.submitter_id,
      'new_music',
      'New music',
      v_name || ' added a track: ' || left(new.title, 120),
      '/music?mode=lounge',
      jsonb_build_object(
        'channel_username', v_channel.username,
        'channel_display_name', v_name,
        'track_title', new.title,
        'track_id', new.id
      ),
      new.submitter_id
    );
  end if;

  return new;
end;
$$;

drop trigger if exists anime_beats_notify_followers_on_approve on public.anime_beats_tracks;

create trigger anime_beats_notify_followers_on_approve
  after insert or update of status on public.anime_beats_tracks
  for each row
  execute function public.trg_notify_beats_track_approved();

create or replace function public.trg_notify_community_post()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_channel public.profiles%rowtype;
  v_name text;
  v_preview text;
begin
  select * into v_channel from public.profiles where id = new.user_id;
  v_name := coalesce(nullif(trim(v_channel.display_name), ''), v_channel.username, 'A channel');
  v_preview := left(trim(new.body), 120);

  perform public._notify_channel_followers(
    new.user_id,
    'community_post',
    'Community post',
    v_name || ' posted in Community',
    '/community/post/' || new.id::text,
    jsonb_build_object(
      'channel_username', v_channel.username,
      'channel_display_name', v_name,
      'post_id', new.id,
      'preview', v_preview
    ),
    new.user_id
  );

  return new;
end;
$$;

drop trigger if exists community_posts_notify_followers on public.community_posts;

create trigger community_posts_notify_followers
  after insert on public.community_posts
  for each row
  execute function public.trg_notify_community_post();

create or replace function public.trg_notify_video_duel()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_challenged public.videos%rowtype;
  v_challenger public.profiles%rowtype;
  v_name text;
begin
  select * into v_challenged
  from public.videos
  where id = new.challenged_video_id;

  if v_challenged.user_id is null then
    return new;
  end if;

  select * into v_challenger from public.profiles where id = new.challenger_user_id;
  v_name := coalesce(nullif(trim(v_challenger.display_name), ''), v_challenger.username, 'Someone');

  perform public._insert_user_notification(
    v_challenged.user_id,
    'video_duel',
    'Clip challenge',
    v_name || ' challenged your clip',
    '/video/' || new.challenged_video_id::text,
    jsonb_build_object(
      'challenger_username', v_challenger.username,
      'challenger_display_name', v_name,
      'duel_id', new.id,
      'video_id', new.challenged_video_id,
      'video_title', v_challenged.title
    )
  );

  return new;
end;
$$;

drop trigger if exists video_duels_notify_owner on public.video_duels;

create trigger video_duels_notify_owner
  after insert on public.video_duels
  for each row
  execute function public.trg_notify_video_duel();

create or replace function public.trg_notify_points_wager_duel()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_creator public.profiles%rowtype;
  v_name text;
begin
  select * into v_creator from public.profiles where id = new.creator_id;
  v_name := coalesce(nullif(trim(v_creator.display_name), ''), v_creator.username, 'Someone');

  perform public._insert_user_notification(
    new.opponent_id,
    'points_duel',
    'Points duel challenge',
    v_name || ' challenged you for ' || new.wager_points::text || ' points',
    '/videos',
    jsonb_build_object(
      'creator_username', v_creator.username,
      'creator_display_name', v_name,
      'duel_id', new.id,
      'wager_points', new.wager_points
    )
  );

  return new;
end;
$$;

drop trigger if exists points_wager_duels_notify_opponent on public.points_wager_duels;

create trigger points_wager_duels_notify_opponent
  after insert on public.points_wager_duels
  for each row
  execute function public.trg_notify_points_wager_duel();

create or replace function public.trg_notify_points_wager_accepted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_opponent public.profiles%rowtype;
  v_name text;
begin
  if old.status = 'pending'
     and new.status = 'active'
     and new.opponent_id is not null then
    select * into v_opponent from public.profiles where id = new.opponent_id;
    v_name := coalesce(nullif(trim(v_opponent.display_name), ''), v_opponent.username, 'Someone');

    perform public._insert_user_notification(
      new.creator_id,
      'points_duel_accepted',
      'Duel accepted',
      v_name || ' accepted your points duel',
      '/videos',
      jsonb_build_object(
        'opponent_username', v_opponent.username,
        'opponent_display_name', v_name,
        'duel_id', new.id,
        'wager_points', new.wager_points
      )
    );
  end if;

  return new;
end;
$$;

drop trigger if exists points_wager_duels_notify_creator_on_accept on public.points_wager_duels;

create trigger points_wager_duels_notify_creator_on_accept
  after update of status on public.points_wager_duels
  for each row
  execute function public.trg_notify_points_wager_accepted();

create or replace function public._notify_season_ended(p_season_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_season public.clash_seasons%rowtype;
begin
  select * into v_season from public.clash_seasons where id = p_season_id;
  if not found then
    return;
  end if;

  perform public._notify_all_users(
    'season_end',
    'Season ended',
    v_season.name || ' has ended. Check the Hall of Legends!',
    '/exclusives',
    jsonb_build_object(
      'season_id', v_season.id,
      'season_name', v_season.name
    )
  );
end;
$$;

create or replace function public._notify_season_started(p_season_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_season public.clash_seasons%rowtype;
begin
  select * into v_season from public.clash_seasons where id = p_season_id;
  if not found then
    return;
  end if;

  perform public._notify_all_users(
    'season_start',
    'New season started',
    v_season.name || ' is now live. Climb the ranks!',
    '/',
    jsonb_build_object(
      'season_id', v_season.id,
      'season_name', v_season.name
    )
  );
end;
$$;

create or replace function public.end_clash_season(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  update public.clash_seasons
  set status = 'ended', updated_at = now()
  where id = p_id
    and status = 'active';

  if not found then
    raise exception 'active season not found';
  end if;

  perform public._auto_snapshot_ended_season(p_id);
  perform public._notify_season_ended(p_id);
end;
$$;

create or replace function public.activate_clash_season(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  ending_season_id uuid;
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  if not exists (
    select 1
    from public.clash_seasons
    where id = p_id
      and status in ('scheduled', 'active')
  ) then
    raise exception 'season not found';
  end if;

  select s.id
  into ending_season_id
  from public.clash_seasons s
  where s.status = 'active'
    and s.id <> p_id
  limit 1;

  if ending_season_id is not null then
    update public.clash_seasons
    set status = 'ended', updated_at = now()
    where id = ending_season_id;

    perform public._auto_snapshot_ended_season(ending_season_id);
    perform public._notify_season_ended(ending_season_id);
  end if;

  update public.clash_seasons
  set status = 'active', updated_at = now()
  where id = p_id;

  perform public._notify_season_started(p_id);
end;
$$;

create or replace function public.start_new_clash_season(
  p_name text default null,
  p_duration_days integer default 30,
  p_prize_rank_1_cents integer default null,
  p_prize_rank_2_cents integer default null,
  p_prize_rank_3_cents integer default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_name text;
  duration_days integer := greatest(coalesce(p_duration_days, 30), 1);
  season_id uuid;
  next_number integer;
  prev_prize_1 integer := 100000;
  prev_prize_2 integer := 50000;
  prev_prize_3 integer := 25000;
  ending_season_id uuid;
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  select s.id
  into ending_season_id
  from public.clash_seasons s
  where s.status = 'active'
  order by s.starts_at desc
  limit 1;

  if ending_season_id is not null then
    update public.clash_seasons
    set status = 'ended', updated_at = now()
    where id = ending_season_id;

    perform public._auto_snapshot_ended_season(ending_season_id);
    perform public._notify_season_ended(ending_season_id);
  end if;

  select
    s.prize_rank_1_cents,
    s.prize_rank_2_cents,
    s.prize_rank_3_cents
  into prev_prize_1, prev_prize_2, prev_prize_3
  from public.clash_seasons s
  where s.id = ending_season_id;

  if ending_season_id is null then
    select
      s.prize_rank_1_cents,
      s.prize_rank_2_cents,
      s.prize_rank_3_cents
    into prev_prize_1, prev_prize_2, prev_prize_3
    from public.clash_seasons s
    order by s.starts_at desc
    limit 1;
  end if;

  normalized_name := trim(coalesce(p_name, ''));
  if normalized_name = '' then
    select count(*) + 1 into next_number from public.clash_seasons;
    normalized_name := 'Season ' || next_number::text;
  end if;

  insert into public.clash_seasons (
    name,
    starts_at,
    ends_at,
    status,
    prize_rank_1_cents,
    prize_rank_2_cents,
    prize_rank_3_cents,
    created_by
  )
  values (
    normalized_name,
    now(),
    now() + make_interval(days => duration_days),
    'active',
    coalesce(p_prize_rank_1_cents, prev_prize_1, 100000),
    coalesce(p_prize_rank_2_cents, prev_prize_2, 50000),
    coalesce(p_prize_rank_3_cents, prev_prize_3, 25000),
    auth.uid()
  )
  returning id into season_id;

  perform public._notify_season_started(season_id);

  return season_id;
end;
$$;

do $$
begin
  alter publication supabase_realtime add table public.user_notifications;
exception
  when duplicate_object then
    null;
  when undefined_object then
    null;
end;
$$;

notify pgrst, 'reload schema';
