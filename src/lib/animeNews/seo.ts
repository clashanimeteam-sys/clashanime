import type { AnimeNewsArticle } from "@/lib/animeNews/types";

const NEWS_SEO_KEYWORDS = {
  en: [
    "latest anime news",
    "anime headlines",
    "Crunchyroll news",
    "seasonal anime guide",
    "anime release news",
  ],
  ar: [
    "آخر أخبار الأنمي",
    "أخبار الأنمي",
    "أهم الأخبار",
    "دليل الموسم",
    "أخبار Crunchyroll",
  ],
  ja: [
    "最新アニメニュース",
    "アニメニュース",
    "注目ニュース",
    "季節アニメガイド",
  ],
} as const;

export function buildAnimeNewsArticleKeywords(article: AnimeNewsArticle): string[] {
  const titles = [
    article.title_en,
    article.title_ar,
    article.title_ja,
    article.excerpt_en,
    article.excerpt_ar,
    article.excerpt_ja,
    article.source_category,
    ...(article.topics ?? []),
  ].filter((value): value is string => Boolean(value?.trim()));

  return [...titles, ...NEWS_SEO_KEYWORDS.en, ...NEWS_SEO_KEYWORDS.ar, ...NEWS_SEO_KEYWORDS.ja];
}

export function buildAnimeNewsTrilingualDescription(article: AnimeNewsArticle): string {
  const parts = [article.excerpt_en, article.excerpt_ar, article.excerpt_ja].filter(
    (value): value is string => Boolean(value?.trim()),
  );

  if (parts.length === 0) {
    return article.title_en;
  }

  return [...new Set(parts)].join(" · ");
}

export function buildAnimeNewsTrilingualHeadline(article: AnimeNewsArticle): string {
  const titles = [article.title_en, article.title_ar, article.title_ja].filter(
    (value): value is string => Boolean(value?.trim()),
  );

  return titles[0] ?? "Anime news";
}

export function buildAnimeNewsAlternateHeadlines(article: AnimeNewsArticle): string[] {
  return [article.title_ar, article.title_ja].filter((value): value is string =>
    Boolean(value?.trim()),
  );
}
