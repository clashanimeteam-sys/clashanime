-- Run in Supabase SQL Editor (production: sghdfqidcdrwaoaxnimz)
-- Safe to re-run. Jikan (MyAnimeList) sync support for Anime Tracker.

-- Anime Tracker: Jikan (MyAnimeList) sync support

alter table public.anime_releases
  add column if not exists mal_id integer;

alter table public.anime_releases
  drop constraint if exists anime_releases_source_check;

alter table public.anime_releases
  add constraint anime_releases_source_check
  check (source in ('manual', 'anilist', 'jikan'));

create unique index if not exists anime_releases_mal_release_uidx
  on public.anime_releases (mal_id, release_date)
  where mal_id is not null;

create or replace function public.upsert_anime_release_from_jikan_sync(
  p_mal_id integer,
  p_title text,
  p_release_date date,
  p_episode_number integer,
  p_airs_at timestamptz default null,
  p_poster_url text default null,
  p_title_ja text default null,
  p_match_tags text[] default '{}'::text[]
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
    updated_at = now()
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.upsert_anime_release_from_jikan_sync(
  integer, text, date, integer, timestamptz, text, text, text[]
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

notify pgrst, 'reload schema';
