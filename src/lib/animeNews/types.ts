import type { Locale } from "@/lib/types";

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
  title_en: string;
  title_ar: string | null;
  title_ja: string | null;
  excerpt_en: string | null;
  excerpt_ar: string | null;
  excerpt_ja: string | null;
  feed_synced_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AnimeNewsCopy = {
  title: string;
  excerpt: string | null;
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

  return { title, excerpt };
}

export function isAnimeNewsPublishReady(article: AnimeNewsArticle): boolean {
  return Boolean(
    article.title_en?.trim() &&
      article.title_ar?.trim() &&
      article.title_ja?.trim() &&
      article.excerpt_en?.trim() &&
      article.excerpt_ar?.trim() &&
      article.excerpt_ja?.trim(),
  );
}
