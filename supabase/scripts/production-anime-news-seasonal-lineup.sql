-- Full seasonal lineup entries stored on featured guide articles

alter table public.anime_news_articles
  add column if not exists seasonal_lineup jsonb not null default '[]'::jsonb;

create index if not exists anime_news_articles_seasonal_lineup_gin_idx
  on public.anime_news_articles using gin (seasonal_lineup);
