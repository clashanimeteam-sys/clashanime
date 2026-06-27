import type { BlogPost } from "@/lib/blog/types";

const BLOG_SEO_KEYWORDS = {
  en: [
    "ClashAnime blog",
    "anime arena guide",
    "anime clash tutorial",
    "ClashCoins guide",
    "anime radar trends",
  ],
  ar: [
    "دليل ClashAnime",
    "دليل الأبطال",
    "تحديات الأنمي",
    "كلاش كوين",
    "رادار الأنمي",
  ],
  ja: [
    "ClashAnime ブログ",
    "英雄アリーナガイド",
    "アニメ対戦 ガイド",
    "クラッシュコイン",
  ],
} as const;

export function buildBlogPostKeywords(post: BlogPost): string[] {
  const titles = Object.values(post.locales).flatMap((copy) => [copy.title, copy.excerpt]);

  return [
    post.category,
    post.slug.replace(/-/g, " "),
    ...titles,
    ...BLOG_SEO_KEYWORDS.en,
    ...BLOG_SEO_KEYWORDS.ar,
    ...BLOG_SEO_KEYWORDS.ja,
  ];
}

export function buildBlogTrilingualDescription(post: BlogPost): string {
  const parts = [post.locales.en?.excerpt, post.locales.ar?.excerpt, post.locales.ja?.excerpt].filter(
    (value): value is string => Boolean(value?.trim()),
  );

  return parts.length > 0 ? [...new Set(parts)].join(" · ") : post.locales.en.excerpt;
}

export function buildBlogTrilingualHeadline(post: BlogPost): string {
  return post.locales.en?.title ?? post.locales.ar?.title ?? post.locales.ja?.title ?? "ClashAnime blog";
}

export function buildBlogAlternateHeadlines(post: BlogPost): string[] {
  return [post.locales.ar?.title, post.locales.ja?.title].filter((value): value is string =>
    Boolean(value?.trim()),
  );
}

export function buildBlogHubKeywords(): string[] {
  return [...BLOG_SEO_KEYWORDS.en, ...BLOG_SEO_KEYWORDS.ar, ...BLOG_SEO_KEYWORDS.ja];
}
