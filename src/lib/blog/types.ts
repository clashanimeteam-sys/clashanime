import type { Locale } from "@/lib/types";

export type BlogCategory =
  | "user-guide"
  | "radar-analysis"
  | "winner-stories"
  | "platform-updates"
  | "earnings-prizes"
  | "faq";

export type BlogPostSection = {
  heading: string;
  body: string;
};

export type BlogPostCopy = {
  title: string;
  excerpt: string;
  sections: BlogPostSection[];
};

export type BlogPost = {
  slug: string;
  category: BlogCategory;
  publishedAt: string;
  readingMinutes: number;
  locales: Record<Locale, BlogPostCopy>;
};
