-- Run in Supabase SQL Editor (production: sghdfqidcdrwaoaxnimz)
-- Safe to re-run. Auto-sync metadata + hashtag usage counts.


-- Anime tracker: auto-sync metadata + batch hashtag usage counts

create table if not exists public.anime_tracker_sync_meta (
  key text primary key,
  last_synced_at timestamptz not null default now(),
  schedule_synced integer not null default 0,
  schedule_errors integer not null default 0,
  clashes_opened integer not null default 0,
  trending_synced integer not null default 0,
  trending_errors integer not null default 0,
  details jsonb not null default '{}'::jsonb
);

alter table public.anime_tracker_sync_meta enable row level security;

drop policy if exists anime_tracker_sync_meta_staff_select on public.anime_tracker_sync_meta;
create policy anime_tracker_sync_meta_staff_select
  on public.anime_tracker_sync_meta
  for select
  using (public.is_staff());

create or replace function public.record_anime_tracker_sync(
  p_schedule_synced integer default 0,
  p_schedule_errors integer default 0,
  p_clashes_opened integer default 0,
  p_trending_synced integer default 0,
  p_trending_errors integer default 0,
  p_details jsonb default '{}'::jsonb
)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  v_at timestamptz := now();
begin
  insert into public.anime_tracker_sync_meta (
    key,
    last_synced_at,
    schedule_synced,
    schedule_errors,
    clashes_opened,
    trending_synced,
    trending_errors,
    details
  )
  values (
    'full',
    v_at,
    coalesce(p_schedule_synced, 0),
    coalesce(p_schedule_errors, 0),
    coalesce(p_clashes_opened, 0),
    coalesce(p_trending_synced, 0),
    coalesce(p_trending_errors, 0),
    coalesce(p_details, '{}'::jsonb)
  )
  on conflict (key) do update set
    last_synced_at = v_at,
    schedule_synced = excluded.schedule_synced,
    schedule_errors = excluded.schedule_errors,
    clashes_opened = excluded.clashes_opened,
    trending_synced = excluded.trending_synced,
    trending_errors = excluded.trending_errors,
    details = excluded.details;

  return v_at;
end;
$$;

grant execute on function public.record_anime_tracker_sync(integer, integer, integer, integer, integer, jsonb)
  to service_role;

create or replace function public.get_anime_tracker_sync_meta()
returns table (
  last_synced_at timestamptz,
  schedule_synced integer,
  schedule_errors integer,
  clashes_opened integer,
  trending_synced integer,
  trending_errors integer
)
language sql
stable
security definer
set search_path = public
as $$
  select
    m.last_synced_at,
    m.schedule_synced,
    m.schedule_errors,
    m.clashes_opened,
    m.trending_synced,
    m.trending_errors
  from public.anime_tracker_sync_meta m
  where m.key = 'full';
$$;

grant execute on function public.get_anime_tracker_sync_meta() to anon, authenticated, service_role;

create or replace function public.get_hashtag_usage_counts(p_tags text[])
returns table (
  tag text,
  usage_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with wanted as (
    select distinct lower(trim(both '#' from coalesce(t.tag, ''))) as tag
    from unnest(coalesce(p_tags, '{}'::text[])) as t(tag)
    where trim(both '#' from coalesce(t.tag, '')) <> ''
  ),
  usage as (
    select
      lower(trim(both '#' from unnest(coalesce(v.hashtags, '{}'::text[])))) as tag
    from public.videos v
    where v.moderation_status = 'approved'
  )
  select
    w.tag,
    count(u.tag)::bigint as usage_count
  from wanted w
  left join usage u on u.tag = w.tag
  group by w.tag
  order by usage_count desc, w.tag asc;
$$;

grant execute on function public.get_hashtag_usage_counts(text[]) to anon, authenticated, service_role;

notify pgrst, 'reload schema';
