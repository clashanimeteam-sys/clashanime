import type { Locale } from "@/lib/types";

export type BlogCategory =
  | "user-guide"
  | "radar-analysis"
  | "winner-stories"
  | "platform-updates"
  | "earnings-prizes"
  | "faq";

export type BlogRoadmapStep = {
  label: string;
  title: string;
  detail: string;
};

export type BlogPostSection = {
  heading: string;
  body: string;
  /** Short hype line shown under the heading */
  hype?: string;
  /** Visual timeline steps (replaces dense numbered lists when present) */
  roadmap?: BlogRoadmapStep[];
  /** “Hero tip” callout at the end of the section */
  tip?: string;
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
