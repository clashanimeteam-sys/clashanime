import { BLOG_POSTS } from "@/lib/blog/content";
import type { BlogCategory, BlogPost, BlogPostCopy } from "@/lib/blog/types";
import type { Locale } from "@/lib/types";

export function getAllBlogPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getBlogPostCopy(slug: string, locale: Locale): BlogPostCopy | null {
  const post = getBlogPost(slug);
  if (!post) return null;
  return post.locales[locale] ?? post.locales.en;
}

export function getBlogPostsByCategory(category: BlogCategory): BlogPost[] {
  return getAllBlogPosts().filter((post) => post.category === category);
}

export function getBlogSlugs(): string[] {
  return BLOG_POSTS.map((post) => post.slug);
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  "user-guide",
  "radar-analysis",
  "winner-stories",
  "platform-updates",
  "earnings-prizes",
  "faq",
];
