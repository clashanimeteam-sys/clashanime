export const LATEST_MIGRATION_CHECKS = [
  {
    id: "profile_social_links",
    migration: "20260320201300_profile_social_links.sql",
    script: "supabase/scripts/production-profile-social-links.sql",
    description: "instagram_url, tiktok_url, twitter_url, website_url on profiles",
  },
  {
    id: "anime_spotlight_catalog",
    migration: "20260320201200_anime_spotlight_catalog.sql",
    script: "supabase/scripts/production-anime-spotlight-catalog.sql",
    description: "Featured anime spotlight catalog table",
  },
  {
    id: "anime_news_seasonal_lineup",
    migration: "20260320201000_anime_news_seasonal_lineup.sql",
    script: "supabase/scripts/production-anime-news-seasonal-lineup.sql",
    description: "seasonal_lineup jsonb on anime_news_articles",
  },
  {
    id: "anime_news_featured",
    migration: "20260320200900_anime_news_featured.sql",
    script: "supabase/scripts/production-anime-news-featured.sql",
    description: "Featured anime news columns",
  },
  {
    id: "anime_news_core",
    migration: "20260320200700_anime_news.sql",
    script: "supabase/scripts/production-anime-news.sql",
    description: "anime_news_articles table",
  },
] as const;

export type SchemaCheckResult = {
  id: string;
  ok: boolean;
  error: string | null;
  migration: string;
  script: string;
  description: string;
};
