import { AnimeWatchNowPageContent } from "@/components/blog/AnimeWatchNowPageContent";
import { JsonLd } from "@/components/JsonLd";
import { loadWatchNowCatalog } from "@/lib/animeNews/watchNow.server";
import { absoluteSiteUrl } from "@/lib/siteSeo";
import { buildBlogHubJsonLd, buildPageMetadata } from "@/lib/seoMetadata";

export const dynamic = "force-dynamic";

const WATCH_NOW_PATH = "/blog/anime-news/watch-now";

export async function generateMetadata() {
  return buildPageMetadata("animeNews", {
    title: "Watch Now — ClashAnime Anime Spotlight",
    description:
      "Browse the full ClashAnime watch-now spotlight: trailers, posters, and curated anime picks across legends, action, romance, and more — شاهد الآن — 今すぐ視聴.",
    path: WATCH_NOW_PATH,
    extraKeywords: ["watch now anime", "شاهد الآن", "今すぐ視聴", "anime spotlight"],
  });
}

export default async function AnimeWatchNowPage() {
  const catalog = await loadWatchNowCatalog();

  return (
    <>
      <JsonLd
        data={buildBlogHubJsonLd({
          title: "Watch Now — ClashAnime",
          description: "Full anime spotlight catalog with trailers and curated picks.",
          url: absoluteSiteUrl(WATCH_NOW_PATH),
        })}
      />
      <AnimeWatchNowPageContent catalog={catalog} />
    </>
  );
}
