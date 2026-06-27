-- Run in Supabase SQL Editor (production: doqiuduigbdoczdzsima)
-- https://supabase.com/dashboard/project/doqiuduigbdoczdzsima/sql/new
--
-- Also run on sghdfqidcdrwaoaxnimz if that project serves production traffic.

alter table public.anime_news_articles
  add column if not exists seasonal_lineup jsonb not null default '[]'::jsonb;

create index if not exists anime_news_articles_seasonal_lineup_gin_idx
  on public.anime_news_articles using gin (seasonal_lineup);

notify pgrst, 'reload schema';
