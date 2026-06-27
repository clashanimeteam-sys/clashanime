-- Anime news hub: Crunchyroll RSS ingest + multilingual editorial pages on ClashAnime

create table if not exists public.anime_news_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  source_guid text not null unique,
  source_url text not null,
  source_author text,
  source_category text,
  cover_image_url text,
  topics text[] not null default '{}',
  published_at timestamptz not null,
  status text not null default 'draft'
    check (status in ('draft', 'published')),
  title_en text not null,
  title_ar text,
  title_ja text,
  excerpt_en text,
  excerpt_ar text,
  excerpt_ja text,
  feed_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists anime_news_articles_status_published_idx
  on public.anime_news_articles (status, published_at desc);

create index if not exists anime_news_articles_topics_gin_idx
  on public.anime_news_articles using gin (topics);

alter table public.anime_news_articles enable row level security;

drop policy if exists anime_news_public_select on public.anime_news_articles;
create policy anime_news_public_select
  on public.anime_news_articles
  for select
  using (status = 'published');

drop policy if exists anime_news_staff_all on public.anime_news_articles;
create policy anime_news_staff_all
  on public.anime_news_articles
  for all
  using (public.is_staff())
  with check (public.is_staff());

create or replace function public.list_anime_news_published(p_limit integer default 24, p_offset integer default 0)
returns setof public.anime_news_articles
language sql
stable
security definer
set search_path = public
as $$
  select *
  from public.anime_news_articles
  where status = 'published'
  order by published_at desc
  limit greatest(p_limit, 1)
  offset greatest(p_offset, 0);
$$;

create or replace function public.get_anime_news_published_by_slug(p_slug text)
returns public.anime_news_articles
language sql
stable
security definer
set search_path = public
as $$
  select *
  from public.anime_news_articles
  where slug = p_slug
    and status = 'published'
  limit 1;
$$;

create or replace function public.list_anime_news_admin()
returns setof public.anime_news_articles
language sql
stable
security definer
set search_path = public
as $$
  select *
  from public.anime_news_articles
  where public.is_staff()
  order by published_at desc, created_at desc;
$$;

create or replace function public.get_anime_news_sync_meta()
returns table (last_synced_at timestamptz, draft_count bigint, published_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select
    max(feed_synced_at) as last_synced_at,
    count(*) filter (where status = 'draft') as draft_count,
    count(*) filter (where status = 'published') as published_count
  from public.anime_news_articles
  where public.is_staff();
$$;

grant execute on function public.list_anime_news_published(integer, integer) to anon, authenticated;
grant execute on function public.get_anime_news_published_by_slug(text) to anon, authenticated;
grant execute on function public.list_anime_news_admin() to authenticated;
grant execute on function public.get_anime_news_sync_meta() to authenticated;
