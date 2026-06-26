-- Instant Episode Clash: 24-hour windows, auto-finalize, points + ClashCoins rewards.

alter table public.anime_release_clashes
  add column if not exists winner_video_id uuid references public.videos (id) on delete set null,
  add column if not exists winner_user_id uuid references auth.users (id) on delete set null,
  add column if not exists finalized_at timestamptz,
  add column if not exists winner_points_awarded integer,
  add column if not exists winner_coins_awarded integer;

create index if not exists anime_release_clashes_finalize_idx
  on public.anime_release_clashes (status, closes_at)
  where status = 'active' and finalized_at is null;

-- Cap any legacy episode clashes still inside the old 7-day window.
update public.anime_release_clashes c
set closes_at = c.opens_at + interval '24 hours'
where c.status = 'active'
  and exists (select 1 from public.anime_releases ar where ar.clash_id = c.id)
  and (
    c.closes_at is null
    or c.closes_at > c.opens_at + interval '24 hours'
  );

create or replace function public.get_anime_release_clash_videos(p_clash_id uuid, p_limit integer default 24)
returns table (
  id uuid,
  title text,
  thumbnail_url text,
  video_url text,
  likes_count integer,
  comments_count integer,
  created_at timestamptz,
  user_id uuid,
  hashtags text[],
  rank_position bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with ranked as (
    select
      v.id,
      v.title,
      v.thumbnail_url,
      v.video_url,
      v.likes_count,
      v.comments_count,
      v.created_at,
      v.user_id,
      v.hashtags,
      row_number() over (
        order by
          (
            v.likes_count
            + v.comments_count * 2
            + coalesce(v.shares_count, 0) * 3
          ) desc,
          v.created_at desc
      ) as rank_position
    from public.anime_release_clashes c
    join public.videos v on v.moderation_status = 'approved'
      and v.created_at >= c.opens_at
      and (c.closes_at is null or v.created_at <= c.closes_at)
      and public._video_matches_anime_tags(v.hashtags, c.match_tags)
    where c.id = p_clash_id
  )
  select *
  from ranked
  order by rank_position asc
  limit greatest(coalesce(p_limit, 24), 1);
$$;

create or replace function public.open_anime_release_clash(p_release_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_release public.anime_releases%rowtype;
  v_clash_id uuid;
  v_clash_title text;
  v_link text;
  v_tags text[];
  v_hashtag_hint text;
begin
  select * into v_release
  from public.anime_releases
  where id = p_release_id
  for update;

  if not found then
    raise exception 'release not found';
  end if;

  if v_release.status = 'cancelled' then
    raise exception 'release is cancelled';
  end if;

  v_tags := public._resolve_anime_match_tags(v_release.id, v_release.match_tags, v_release.title);

  update public.anime_releases
  set
    match_tags = v_tags,
    updated_at = now()
  where id = p_release_id;

  if v_release.clash_id is not null then
    update public.anime_release_clashes
    set match_tags = v_tags
    where id = v_release.clash_id;

    return v_release.clash_id;
  end if;

  v_clash_title := trim(v_release.title) || ' · Ep ' || coalesce(v_release.episode_number, 1)::text;

  insert into public.anime_release_clashes (
    title,
    status,
    match_tags,
    opens_at,
    closes_at
  )
  values (
    v_clash_title,
    'active',
    v_tags,
    now(),
    now() + interval '24 hours'
  )
  returning id into v_clash_id;

  update public.anime_releases
  set
    status = 'released',
    clash_id = v_clash_id,
    updated_at = now()
  where id = p_release_id;

  v_link := '/tracker/clash/' || v_clash_id::text;
  v_hashtag_hint := array_to_string(
    array(
      select '#' || tag
      from unnest(v_tags) as tag
      limit 4
    ),
    ' '
  );

  perform public._notify_all_users(
    'anime_release_clash',
    'Instant episode clash — 24 hours only',
    v_clash_title || ' is live for 24 hours! Use ' || v_hashtag_hint || ' and upload your best scene now.',
    v_link,
    jsonb_build_object(
      'release_id', p_release_id,
      'clash_id', v_clash_id,
      'anime_title', v_release.title,
      'episode_number', v_release.episode_number,
      'match_tags', to_jsonb(v_tags),
      'primary_hashtag', 'clashanime',
      'hashtag_hint', v_hashtag_hint,
      'window_hours', 24,
      'reward_points', 2000,
      'reward_clash_coins', 5000
    )
  );

  update public.anime_release_clashes
  set notification_sent = true
  where id = v_clash_id;

  return v_clash_id;
end;
$$;

create or replace function public.finalize_expired_anime_release_clashes()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer := 0;
  v_points constant integer := 2000;
  v_coins constant integer := 5000;
  r record;
  w record;
  v_winner_name text;
  v_link text;
begin
  for r in
    select
      c.id as clash_id,
      c.title as clash_title,
      ar.title as anime_title,
      ar.episode_number
    from public.anime_release_clashes c
    join public.anime_releases ar on ar.clash_id = c.id
    where c.status = 'active'
      and c.closes_at is not null
      and c.closes_at <= now()
      and c.finalized_at is null
    order by c.closes_at asc
  loop
    select
      ranked.id,
      ranked.user_id,
      ranked.title
    into w
    from public.get_anime_release_clash_videos(r.clash_id, 1) as ranked
    limit 1;

    if found and w.user_id is not null then
      perform public.award_points(
        w.user_id,
        v_points,
        'episode_clash_winner',
        jsonb_build_object(
          'clash_id', r.clash_id,
          'video_id', w.id,
          'anime_title', r.anime_title,
          'episode_number', r.episode_number
        )
      );

      perform public.award_clash_coins(
        w.user_id,
        v_coins,
        'episode_clash_winner',
        jsonb_build_object(
          'clash_id', r.clash_id,
          'video_id', w.id,
          'anime_title', r.anime_title,
          'episode_number', r.episode_number
        )
      );

      update public.anime_release_clashes
      set
        status = 'ended',
        finalized_at = now(),
        winner_video_id = w.id,
        winner_user_id = w.user_id,
        winner_points_awarded = v_points,
        winner_coins_awarded = v_coins
      where id = r.clash_id;

      select coalesce(nullif(trim(p.display_name), ''), p.username, 'A hunter')
      into v_winner_name
      from public.profiles p
      where p.id = w.user_id;

      v_link := '/video/' || w.id::text;

      perform public._insert_user_notification(
        w.user_id,
        'episode_clash_winner',
        'You are the episode king!',
        'You won ' || r.clash_title || ' with +' || v_points::text || ' points and +' || v_coins::text || ' ClashCoins.',
        v_link,
        jsonb_build_object(
          'clash_id', r.clash_id,
          'video_id', w.id,
          'anime_title', r.anime_title,
          'episode_number', r.episode_number,
          'points_awarded', v_points,
          'coins_awarded', v_coins,
          'badge_label', 'Episode ' || r.episode_number::text || ' King'
        )
      );

      perform public._notify_all_users(
        'episode_clash_crowned',
        'Episode king crowned',
        v_winner_name || ' won ' || r.clash_title || ' — the 24-hour window is closed.',
        v_link,
        jsonb_build_object(
          'clash_id', r.clash_id,
          'video_id', w.id,
          'winner_user_id', w.user_id,
          'winner_display_name', v_winner_name,
          'anime_title', r.anime_title,
          'episode_number', r.episode_number
        )
      );
    else
      update public.anime_release_clashes
      set
        status = 'ended',
        finalized_at = now()
      where id = r.clash_id;
    end if;

    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;

create or replace function public.process_due_anime_release_clashes()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_opened integer := 0;
  r record;
begin
  perform public.finalize_expired_anime_release_clashes();

  for r in
    select ar.id
    from public.anime_releases ar
    where ar.status = 'scheduled'
      and ar.clash_id is null
      and (
        ar.release_date <= current_date
        or (ar.airs_at is not null and ar.airs_at <= now())
      )
    order by ar.release_date asc, ar.airs_at asc nulls last
  loop
    perform public.open_anime_release_clash(r.id);
    v_opened := v_opened + 1;
  end loop;

  return v_opened;
end;
$$;

grant execute on function public.finalize_expired_anime_release_clashes() to service_role;
grant execute on function public.get_anime_release_clash_videos(uuid, integer) to anon, authenticated, service_role;

notify pgrst, 'reload schema';
