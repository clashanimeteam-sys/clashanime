-- Resolve short match tags (with #clashanime) for clashes, uploads, and notifications

create or replace function public._resolve_anime_match_tags(
  p_release_id uuid,
  p_fallback_tags text[],
  p_title text default null
)
returns text[]
language sql
stable
as $$
  select
    case
      when coalesce(array_length(s.short_tags, 1), 0) > 0 then
        public._normalize_anime_match_tags(s.short_tags, coalesce(nullif(trim(p_title), ''), s.title_en))
      else
        public._normalize_anime_match_tags(coalesce(p_fallback_tags, '{}'::text[]), p_title)
    end
  from public.anime_releases ar
  left join public.anime_trending_spotlight s
    on s.release_id = ar.id
    or (s.release_id is null and s.mal_id = ar.mal_id and ar.source = 'trending')
  where ar.id = p_release_id
  limit 1;
$$;

create or replace function public.refresh_short_anime_match_tags()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer := 0;
  r record;
  v_tags text[];
begin
  for r in
    select
      ar.id,
      ar.title,
      ar.match_tags,
      s.short_tags
    from public.anime_releases ar
    left join public.anime_trending_spotlight s
      on s.release_id = ar.id
      or (s.release_id is null and s.mal_id = ar.mal_id and ar.source = 'trending')
  loop
    if coalesce(array_length(r.short_tags, 1), 0) > 0 then
      v_tags := public._normalize_anime_match_tags(r.short_tags, r.title);
    else
      v_tags := public._normalize_anime_match_tags(r.match_tags, r.title);
    end if;

    update public.anime_releases
    set
      match_tags = v_tags,
      updated_at = now()
    where id = r.id;

    v_count := v_count + 1;
  end loop;

  update public.anime_release_clashes c
  set match_tags = ar.match_tags
  from public.anime_releases ar
  where ar.clash_id = c.id;

  return v_count;
end;
$$;

drop function if exists public.get_anime_release_clash_detail(uuid);

create or replace function public.get_anime_release_clash_detail(p_clash_id uuid)
returns table (
  clash_id uuid,
  clash_title text,
  release_id uuid,
  anime_title text,
  title_ar text,
  title_ja text,
  episode_number integer,
  poster_url text,
  synopsis_en text,
  synopsis_ar text,
  synopsis_ja text,
  match_tags text[],
  opens_at timestamptz,
  closes_at timestamptz,
  clash_status text,
  clip_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    c.id as clash_id,
    c.title as clash_title,
    ar.id as release_id,
    ar.title as anime_title,
    ar.title_ar,
    ar.title_ja,
    ar.episode_number,
    ar.poster_url,
    ar.synopsis_en,
    ar.synopsis_ar,
    ar.synopsis_ja,
    public._resolve_anime_match_tags(ar.id, c.match_tags, ar.title) as match_tags,
    c.opens_at,
    c.closes_at,
    c.status as clash_status,
    (
      select count(*)
      from public.videos v
      where v.moderation_status = 'approved'
        and public._video_matches_anime_tags(
          v.hashtags,
          public._resolve_anime_match_tags(ar.id, c.match_tags, ar.title)
        )
    ) as clip_count
  from public.anime_release_clashes c
  join public.anime_releases ar on ar.clash_id = c.id
  where c.id = p_clash_id;
$$;

grant execute on function public.get_anime_release_clash_detail(uuid) to anon, authenticated, service_role;

drop function if exists public.get_active_anime_release_clashes();

create or replace function public.get_active_anime_release_clashes()
returns table (
  clash_id uuid,
  clash_title text,
  release_id uuid,
  anime_title text,
  title_ar text,
  title_ja text,
  episode_number integer,
  poster_url text,
  synopsis_en text,
  synopsis_ar text,
  synopsis_ja text,
  match_tags text[],
  opens_at timestamptz,
  closes_at timestamptz,
  clip_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    c.id as clash_id,
    c.title as clash_title,
    ar.id as release_id,
    ar.title as anime_title,
    ar.title_ar,
    ar.title_ja,
    ar.episode_number,
    ar.poster_url,
    ar.synopsis_en,
    ar.synopsis_ar,
    ar.synopsis_ja,
    public._resolve_anime_match_tags(ar.id, c.match_tags, ar.title) as match_tags,
    c.opens_at,
    c.closes_at,
    (
      select count(*)
      from public.videos v
      where v.moderation_status = 'approved'
        and public._video_matches_anime_tags(
          v.hashtags,
          public._resolve_anime_match_tags(ar.id, c.match_tags, ar.title)
        )
    ) as clip_count
  from public.anime_release_clashes c
  join public.anime_releases ar on ar.clash_id = c.id
  where c.status = 'active'
    and (c.closes_at is null or c.closes_at > now())
  order by c.opens_at desc;
$$;

grant execute on function public.get_active_anime_release_clashes() to anon, authenticated, service_role;

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
    episode_number = excluded.episode_number,
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
    now() + interval '7 days'
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
    'New anime release clash',
    v_clash_title || ' just dropped. Use ' || v_hashtag_hint || ' and submit your best clip!',
    v_link,
    jsonb_build_object(
      'release_id', p_release_id,
      'clash_id', v_clash_id,
      'anime_title', v_release.title,
      'episode_number', v_release.episode_number,
      'match_tags', to_jsonb(v_tags),
      'primary_hashtag', 'clashanime',
      'hashtag_hint', v_hashtag_hint
    )
  );

  update public.anime_release_clashes
  set notification_sent = true
  where id = v_clash_id;

  return v_clash_id;
end;
$$;

create or replace function public.notify_trending_spotlight_launch()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1
    from public.anime_trending_spotlight
    where launch_notified = true
  ) then
    return false;
  end if;

  if not exists (
    select 1
    from public.anime_trending_spotlight s
    join public.anime_releases ar on ar.id = s.release_id
    where s.active = true
      and ar.clash_id is not null
  ) then
    return false;
  end if;

  perform public._notify_all_users(
    'anime_release_clash',
    'Trending anime clashes are live',
    'The top 10 trending anime arena is open. Upload with #clashanime and join the battles!',
    '/tracker',
    jsonb_build_object(
      'kind', 'trending_spotlight_launch',
      'primary_hashtag', 'clashanime',
      'hashtag_hint', '#clashanime'
    )
  );

  update public.anime_trending_spotlight
  set launch_notified = true,
      updated_at = now();

  return true;
end;
$$;

select public.refresh_short_anime_match_tags();

notify pgrst, 'reload schema';
