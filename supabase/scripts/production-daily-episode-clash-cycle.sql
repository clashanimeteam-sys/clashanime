-- Daily 24h episode clash cycle: auto-finalize, reopen trending top-10, notify on every new window.

create or replace function public._notify_episode_clash_opened(
  p_clash_id uuid,
  p_anime_title text,
  p_episode_number integer,
  p_tags text[],
  p_kind text default 'episode'
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_link text;
  v_hashtag_hint text;
  v_title text;
  v_body text;
begin
  v_link := '/tracker/clash/' || p_clash_id::text;
  v_hashtag_hint := array_to_string(
    array(
      select '#' || tag
      from unnest(coalesce(p_tags, '{}'::text[])) as tag
      limit 4
    ),
    ' '
  );

  if p_kind = 'trending' then
    v_title := 'Daily trending clash — 24 hours';
    v_body := trim(p_anime_title) || ' Ep ' || coalesce(p_episode_number, 1)::text
      || ' is live for 24 hours! Use ' || v_hashtag_hint
      || ' — winner gets +2,000 points & +5,000 ClashCoins.';
  else
    v_title := 'Instant episode clash — 24 hours only';
    v_body := trim(p_anime_title) || ' Ep ' || coalesce(p_episode_number, 1)::text
      || ' is live for 24 hours! Use ' || v_hashtag_hint
      || ' and upload your best scene now.';
  end if;

  perform public._notify_all_users(
    'anime_release_clash',
    v_title,
    v_body,
    v_link,
    jsonb_build_object(
      'clash_id', p_clash_id,
      'anime_title', p_anime_title,
      'episode_number', coalesce(p_episode_number, 1),
      'match_tags', to_jsonb(coalesce(p_tags, '{}'::text[])),
      'primary_hashtag', 'clashanime',
      'hashtag_hint', v_hashtag_hint,
      'window_hours', 24,
      'reward_points', 2000,
      'reward_clash_coins', 5000,
      'kind', p_kind
    )
  );
end;
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
  v_tags text[];
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

  perform public._notify_episode_clash_opened(
    v_clash_id,
    v_release.title,
    v_release.episode_number,
    v_tags,
    case when v_release.source = 'trending' then 'trending' else 'episode' end
  );

  update public.anime_release_clashes
  set notification_sent = true
  where id = v_clash_id;

  return v_clash_id;
end;
$$;

create or replace function public.open_trending_spotlight_clash(p_release_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_release public.anime_releases%rowtype;
  v_clash_id uuid;
  v_clash_title text;
  v_clash public.anime_release_clashes%rowtype;
  v_tags text[];
  v_episode integer;
  v_should_notify boolean := false;
begin
  select * into v_release
  from public.anime_releases
  where id = p_release_id
  for update;

  if not found then
    raise exception 'release not found';
  end if;

  if v_release.source <> 'trending' then
    raise exception 'not a trending release';
  end if;

  v_tags := public._resolve_anime_match_tags(v_release.id, v_release.match_tags, v_release.title);

  if v_release.clash_id is not null then
    select * into v_clash
    from public.anime_release_clashes
    where id = v_release.clash_id;

    if v_clash.status = 'active'
      and v_clash.closes_at is not null
      and least(v_clash.closes_at, v_clash.opens_at + interval '24 hours') > now() then
      update public.anime_release_clashes
      set
        match_tags = v_tags,
        closes_at = least(v_clash.closes_at, v_clash.opens_at + interval '24 hours')
      where id = v_release.clash_id;

      update public.anime_releases
      set
        match_tags = v_tags,
        updated_at = now()
      where id = p_release_id;

      return v_release.clash_id;
    end if;

    update public.anime_releases
    set
      episode_number = greatest(coalesce(v_release.episode_number, 1), 1) + 1,
      match_tags = v_tags,
      updated_at = now()
    where id = p_release_id
    returning episode_number into v_episode;

    v_clash_title := trim(v_release.title) || ' · Ep ' || v_episode::text;
    v_should_notify := true;

    update public.anime_release_clashes
    set
      title = v_clash_title,
      status = 'active',
      match_tags = v_tags,
      opens_at = now(),
      closes_at = now() + interval '24 hours',
      finalized_at = null,
      winner_video_id = null,
      winner_user_id = null,
      winner_points_awarded = null,
      winner_coins_awarded = null,
      notification_sent = false
    where id = v_release.clash_id;

    if v_should_notify then
      perform public._notify_episode_clash_opened(
        v_release.clash_id,
        v_release.title,
        v_episode,
        v_tags,
        'trending'
      );

      update public.anime_release_clashes
      set notification_sent = true
      where id = v_release.clash_id;
    end if;

    return v_release.clash_id;
  end if;

  v_episode := greatest(coalesce(v_release.episode_number, 1), 1);
  v_clash_title := trim(v_release.title) || ' · Ep ' || v_episode::text;

  insert into public.anime_release_clashes (
    title,
    status,
    match_tags,
    opens_at,
    closes_at,
    notification_sent
  )
  values (
    v_clash_title,
    'active',
    v_tags,
    now(),
    now() + interval '24 hours',
    false
  )
  returning id into v_clash_id;

  update public.anime_releases
  set
    clash_id = v_clash_id,
    match_tags = v_tags,
    updated_at = now()
  where id = p_release_id;

  perform public._notify_episode_clash_opened(
    v_clash_id,
    v_release.title,
    v_episode,
    v_tags,
    'trending'
  );

  update public.anime_release_clashes
  set notification_sent = true
  where id = v_clash_id;

  return v_clash_id;
end;
$$;

create or replace function public.upsert_anime_release_from_trending_sync(
  p_mal_id integer,
  p_title text,
  p_title_ja text default null,
  p_poster_url text default null,
  p_synopsis_en text default null,
  p_match_tags text[] default '{}'::text[],
  p_mal_score numeric default null,
  p_episodes_total integer default null,
  p_broadcast_label text default null,
  p_airing_status text default null,
  p_episode_number integer default 1
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_tags text[];
  v_short_tags text[];
begin
  if p_mal_id is null or trim(coalesce(p_title, '')) = '' then
    raise exception 'mal id and title required';
  end if;

  select s.short_tags
  into v_short_tags
  from public.anime_trending_spotlight s
  where s.mal_id = p_mal_id
    and s.active = true
  limit 1;

  if coalesce(array_length(v_short_tags, 1), 0) > 0 then
    v_tags := public._normalize_anime_match_tags(v_short_tags, p_title);
  else
    v_tags := public._normalize_anime_match_tags(p_match_tags, p_title);
  end if;

  insert into public.anime_releases (
    title,
    title_ja,
    mal_id,
    release_date,
    episode_number,
    poster_url,
    match_tags,
    synopsis_en,
    mal_score,
    episodes_total,
    broadcast_label,
    airing_status,
    source,
    status
  )
  values (
    trim(p_title),
    nullif(trim(coalesce(p_title_ja, '')), ''),
    p_mal_id,
    current_date,
    greatest(coalesce(p_episode_number, 1), 1),
    nullif(trim(coalesce(p_poster_url, '')), ''),
    v_tags,
    nullif(trim(coalesce(p_synopsis_en, '')), ''),
    p_mal_score,
    p_episodes_total,
    nullif(trim(coalesce(p_broadcast_label, '')), ''),
    nullif(trim(coalesce(p_airing_status, '')), ''),
    'trending',
    'released'
  )
  on conflict (mal_id) where mal_id is not null and source = 'trending'
  do update set
    title = excluded.title,
    title_ja = excluded.title_ja,
    poster_url = coalesce(excluded.poster_url, anime_releases.poster_url),
    match_tags = excluded.match_tags,
    synopsis_en = coalesce(excluded.synopsis_en, anime_releases.synopsis_en),
    mal_score = excluded.mal_score,
    episodes_total = excluded.episodes_total,
    broadcast_label = excluded.broadcast_label,
    airing_status = excluded.airing_status,
    updated_at = now()
  returning id into v_id;

  update public.anime_release_clashes c
  set match_tags = ar.match_tags
  from public.anime_releases ar
  where ar.id = v_id
    and ar.clash_id = c.id;

  return v_id;
end;
$$;

grant execute on function public._notify_episode_clash_opened(uuid, text, integer, text[], text) to service_role;
grant execute on function public.open_trending_spotlight_clash(uuid) to service_role;

notify pgrst, 'reload schema';
