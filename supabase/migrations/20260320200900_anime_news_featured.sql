-- Featured seasonal guide spotlight on blog hub

alter table public.anime_news_articles
  add column if not exists is_featured boolean not null default false,
  add column if not exists featured_order integer not null default 0;

create index if not exists anime_news_articles_featured_idx
  on public.anime_news_articles (is_featured, featured_order desc, published_at desc)
  where is_featured = true;

create or replace function public.get_featured_seasonal_guide()
returns public.anime_news_articles
language sql
stable
security definer
set search_path = public
as $$
  select *
  from public.anime_news_articles
  where status = 'published'
    and is_featured = true
  order by featured_order desc, published_at desc
  limit 1;
$$;

grant execute on function public.get_featured_seasonal_guide() to anon, authenticated;
