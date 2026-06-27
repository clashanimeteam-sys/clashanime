import type { Metadata } from "next";
import { BlogIndexContent } from "@/components/blog/BlogIndexContent";
import { listPublishedAnimeNews } from "@/lib/animeNews.server";
import { buildPageMetadata } from "@/lib/seoMetadata";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("blog");
}

export default async function BlogPage() {
  const latestNews = await listPublishedAnimeNews(3, 0);
  return <BlogIndexContent latestNews={latestNews} />;
}
