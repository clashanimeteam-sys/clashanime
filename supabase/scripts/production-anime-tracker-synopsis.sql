-- Run in Supabase SQL Editor (production: sghdfqidcdrwaoaxnimz)
-- Safe to re-run. Multilingual synopsis support for Anime Tracker.

-- Anime Tracker: multilingual synopsis on releases

alter table public.anime_releases
  add column if not exists synopsis_en text,
  add column if not exists synopsis_ar text,
  add column if not exists synopsis_ja text;

drop function if exists public.upsert_anime_release_from_jikan_sync(
  integer, text, date, integer, timestamptz, text, text, text[]
);

create or replace function public.upsert_anime_release_from_jikan_sync(
  p_mal_id integer,
  p_title text,
  p_release_date date,
  p_episode_number integer,
  p_airs_at timestamptz default null,
  p_poster_url text default null,
  p_title_ja text default null,
  p_match_tags text[] default '{}'::text[],
  p_synopsis_en text default null,
  p_synopsis_ar text default null,
  p_synopsis_ja text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_tags text[];
begin
  if p_mal_id is null or trim(coalesce(p_title, '')) = '' then
    raise exception 'mal id and title required';
  end if;

  if p_release_date is null then
    raise exception 'release date required';
  end if;

  v_tags := public._normalize_anime_match_tags(p_match_tags, p_title);

  insert into public.anime_releases (
    title,
    title_ja,
    mal_id,
    release_date,
    airs_at,
    episode_number,
    poster_url,
    match_tags,
    synopsis_en,
    synopsis_ar,
    synopsis_ja,
    source
  )
  values (
    trim(p_title),
    nullif(trim(coalesce(p_title_ja, '')), ''),
    p_mal_id,
    p_release_date,
    p_airs_at,
    greatest(coalesce(p_episode_number, 1), 1),
    nullif(trim(coalesce(p_poster_url, '')), ''),
    v_tags,
    nullif(trim(coalesce(p_synopsis_en, '')), ''),
    nullif(trim(coalesce(p_synopsis_ar, '')), ''),
    nullif(trim(coalesce(p_synopsis_ja, '')), ''),
    'jikan'
  )
  on conflict (mal_id, release_date) where mal_id is not null
  do update set
    title = excluded.title,
    title_ja = excluded.title_ja,
    airs_at = excluded.airs_at,
    episode_number = excluded.episode_number,
    poster_url = coalesce(excluded.poster_url, anime_releases.poster_url),
    match_tags = excluded.match_tags,
    synopsis_en = coalesce(excluded.synopsis_en, anime_releases.synopsis_en),
    synopsis_ar = coalesce(excluded.synopsis_ar, anime_releases.synopsis_ar),
    synopsis_ja = coalesce(excluded.synopsis_ja, anime_releases.synopsis_ja),
    updated_at = now()
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.upsert_anime_release_from_jikan_sync(
  integer, text, date, integer, timestamptz, text, text, text[], text, text, text
) to service_role;

drop function if exists public.get_anime_tracker_today();

create or replace function public.get_anime_tracker_today()
returns table (
  id uuid,
  title text,
  title_ar text,
  title_ja text,
  mal_id integer,
  release_date date,
  airs_at timestamptz,
  episode_number integer,
  poster_url text,
  match_tags text[],
  synopsis_en text,
  synopsis_ar text,
  synopsis_ja text,
  status text,
  clash_id uuid,
  clash_status text,
  clash_opens_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    ar.id,
    ar.title,
    ar.title_ar,
    ar.title_ja,
    ar.mal_id,
    ar.release_date,
    ar.airs_at,
    ar.episode_number,
    ar.poster_url,
    ar.match_tags,
    ar.synopsis_en,
    ar.synopsis_ar,
    ar.synopsis_ja,
    ar.status,
    ar.clash_id,
    c.status as clash_status,
    c.opens_at as clash_opens_at
  from public.anime_releases ar
  left join public.anime_release_clashes c on c.id = ar.clash_id
  where ar.status <> 'cancelled'
    and ar.release_date = current_date
  order by coalesce(ar.airs_at, ar.release_date::timestamptz) asc, ar.title asc;
$$;

grant execute on function public.get_anime_tracker_today() to anon, authenticated, service_role;

drop function if exists public.get_anime_tracker_upcoming(integer);

create or replace function public.get_anime_tracker_upcoming(p_days integer default 14)
returns table (
  id uuid,
  title text,
  title_ar text,
  title_ja text,
  release_date date,
  airs_at timestamptz,
  episode_number integer,
  poster_url text,
  synopsis_en text,
  synopsis_ar text,
  synopsis_ja text,
  status text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    ar.id,
    ar.title,
    ar.title_ar,
    ar.title_ja,
    ar.release_date,
    ar.airs_at,
    ar.episode_number,
    ar.poster_url,
    ar.synopsis_en,
    ar.synopsis_ar,
    ar.synopsis_ja,
    ar.status
  from public.anime_releases ar
  where ar.status = 'scheduled'
    and ar.release_date > current_date
    and ar.release_date <= current_date + make_interval(days => greatest(coalesce(p_days, 14), 1))
  order by ar.release_date asc, ar.title asc;
$$;

grant execute on function public.get_anime_tracker_upcoming(integer) to anon, authenticated, service_role;

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
    c.match_tags,
    c.opens_at,
    c.closes_at,
    (
      select count(*)
      from public.videos v
      where v.moderation_status = 'approved'
        and public._video_matches_anime_tags(v.hashtags, c.match_tags)
    ) as clip_count
  from public.anime_release_clashes c
  join public.anime_releases ar on ar.clash_id = c.id
  where c.status = 'active'
    and (c.closes_at is null or c.closes_at > now())
  order by c.opens_at desc;
$$;

grant execute on function public.get_active_anime_release_clashes() to anon, authenticated, service_role;

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
  clash_status text
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
    c.match_tags,
    c.opens_at,
    c.closes_at,
    c.status as clash_status
  from public.anime_release_clashes c
  join public.anime_releases ar on ar.clash_id = c.id
  where c.id = p_clash_id;
$$;

grant execute on function public.get_anime_release_clash_detail(uuid) to anon, authenticated, service_role;

drop function if exists public.list_anime_releases_admin();

create or replace function public.list_anime_releases_admin()
returns table (
  id uuid,
  title text,
  title_ar text,
  title_ja text,
  anilist_id integer,
  release_date date,
  airs_at timestamptz,
  episode_number integer,
  poster_url text,
  match_tags text[],
  synopsis_en text,
  synopsis_ar text,
  synopsis_ja text,
  status text,
  source text,
  clash_id uuid,
  notes text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    ar.id,
    ar.title,
    ar.title_ar,
    ar.title_ja,
    ar.anilist_id,
    ar.release_date,
    ar.airs_at,
    ar.episode_number,
    ar.poster_url,
    ar.match_tags,
    ar.synopsis_en,
    ar.synopsis_ar,
    ar.synopsis_ja,
    ar.status,
    ar.source,
    ar.clash_id,
    ar.notes,
    ar.created_at
  from public.anime_releases ar
  order by ar.release_date desc, ar.created_at desc;
$$;

grant execute on function public.list_anime_releases_admin() to authenticated, service_role;

drop function if exists public.create_anime_release_admin(
  text, date, text, text, integer, text, text[], timestamptz, integer, text, boolean
);

create or replace function public.create_anime_release_admin(
  p_title text,
  p_release_date date,
  p_title_ar text default null,
  p_title_ja text default null,
  p_episode_number integer default 1,
  p_poster_url text default null,
  p_match_tags text[] default '{}'::text[],
  p_airs_at timestamptz default null,
  p_anilist_id integer default null,
  p_notes text default null,
  p_open_clash boolean default false,
  p_synopsis_en text default null,
  p_synopsis_ar text default null,
  p_synopsis_ja text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_tags text[];
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  if trim(coalesce(p_title, '')) = '' then
    raise exception 'title required';
  end if;

  if p_release_date is null then
    raise exception 'release date required';
  end if;

  v_tags := public._normalize_anime_match_tags(p_match_tags, p_title);

  insert into public.anime_releases (
    title,
    title_ar,
    title_ja,
    anilist_id,
    release_date,
    airs_at,
    episode_number,
    poster_url,
    match_tags,
    synopsis_en,
    synopsis_ar,
    synopsis_ja,
    source,
    notes,
    created_by
  )
  values (
    trim(p_title),
    nullif(trim(coalesce(p_title_ar, '')), ''),
    nullif(trim(coalesce(p_title_ja, '')), ''),
    p_anilist_id,
    p_release_date,
    p_airs_at,
    greatest(coalesce(p_episode_number, 1), 1),
    nullif(trim(coalesce(p_poster_url, '')), ''),
    v_tags,
    nullif(trim(coalesce(p_synopsis_en, '')), ''),
    nullif(trim(coalesce(p_synopsis_ar, '')), ''),
    nullif(trim(coalesce(p_synopsis_ja, '')), ''),
    'manual',
    nullif(trim(coalesce(p_notes, '')), ''),
    auth.uid()
  )
  returning id into v_id;

  if p_open_clash then
    perform public.open_anime_release_clash(v_id);
  end if;

  return v_id;
end;
$$;

grant execute on function public.create_anime_release_admin(
  text, date, text, text, integer, text, text[], timestamptz, integer, text, boolean, text, text, text
) to authenticated, service_role;

notify pgrst, 'reload schema';
