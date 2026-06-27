-- Add multilingual story body for anime news articles

alter table public.anime_news_articles
  add column if not exists story_en text,
  add column if not exists story_ar text,
  add column if not exists story_ja text;
