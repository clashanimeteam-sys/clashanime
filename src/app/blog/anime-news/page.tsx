import { AnimeNewsIndexContent } from "@/components/blog/AnimeNewsIndexContent";
import { listPublishedAnimeNews } from "@/lib/animeNews.server";
import { buildPageMetadata } from "@/lib/seoMetadata";

export const revalidate = 3600;

export async function generateMetadata() {
  return buildPageMetadata("animeNews");
}

export default async function AnimeNewsIndexPage() {
  const articles = await listPublishedAnimeNews(24, 0);
  return <AnimeNewsIndexContent articles={articles} />;
}
