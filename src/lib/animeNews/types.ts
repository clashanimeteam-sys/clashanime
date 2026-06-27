import type { Locale } from "@/lib/types";
import type { SeasonalLineupEntry } from "@/lib/animeNews/seasonalLineupTypes";
import { parseSeasonalLineup } from "@/lib/animeNews/seasonalLineupTypes";

export type AnimeNewsStatus = "draft" | "published";

export type AnimeNewsArticle = {
  id: string;
  slug: string;
  source_guid: string;
  source_url: string;
  source_author: string | null;
  source_category: string | null;
  cover_image_url: string | null;
  topics: string[];
  published_at: string;
  status: AnimeNewsStatus;
  is_featured?: boolean;
  featured_order?: number;
  title_en: string;
  title_ar: string | null;
  title_ja: string | null;
  excerpt_en: string | null;
  excerpt_ar: string | null;
  excerpt_ja: string | null;
  story_en: string | null;
  story_ar: string | null;
  story_ja: string | null;
  seasonal_lineup?: SeasonalLineupEntry[];
  feed_synced_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AnimeNewsCopy = {
  title: string;
  excerpt: string | null;
  story: string | null;
};

export function getAnimeNewsCopy(article: AnimeNewsArticle, locale: Locale): AnimeNewsCopy {
  const title =
    (locale === "ar" ? article.title_ar : locale === "ja" ? article.title_ja : article.title_en) ??
    article.title_en;

  const excerpt =
    (locale === "ar"
      ? article.excerpt_ar
      : locale === "ja"
        ? article.excerpt_ja
        : article.excerpt_en) ??
    article.excerpt_en ??
    article.excerpt_ar ??
    article.excerpt_ja;

  const story =
    (locale === "ar"
      ? article.story_ar
      : locale === "ja"
        ? article.story_ja
        : article.story_en) ??
    article.story_en ??
    article.story_ar ??
    article.story_ja;

  return { title, excerpt, story };
}

export function getSeasonalLineup(article: AnimeNewsArticle): SeasonalLineupEntry[] {
  return parseSeasonalLineup(article.seasonal_lineup);
}

export function isAnimeNewsPublishReady(article: AnimeNewsArticle): boolean {
  return Boolean(article.title_en?.trim() && article.excerpt_en?.trim());
}
