import { JsonLd } from "@/components/JsonLd";
import { AnimeNewsIndexContent } from "@/components/blog/AnimeNewsIndexContent";
import { listPublishedAnimeNews } from "@/lib/animeNews.server";
import { absoluteSiteUrl } from "@/lib/siteSeo";
import { buildBlogHubJsonLd, buildPageMetadata, PAGE_SEO } from "@/lib/seoMetadata";

export const dynamic = "force-dynamic";

const ANIME_NEWS_HUB_KEYWORDS = [
  "latest anime news",
  "top anime news",
  "anime news hub",
  "آخر أخبار الأنمي",
  "أهم الأخبار",
  "最新アニメニュース",
  "注目ニュース",
  "seasonal anime guide",
  "دليل الموسم",
  "季節アニメガイド",
];

export async function generateMetadata() {
  return buildPageMetadata("animeNews", {
    extraKeywords: ANIME_NEWS_HUB_KEYWORDS,
  });
}

export default async function AnimeNewsIndexPage() {
  const articles = await listPublishedAnimeNews(24, 0);
  const config = PAGE_SEO.animeNews;

  return (
    <>
      <JsonLd
        data={buildBlogHubJsonLd({
          title: config.title,
          description: config.description,
          url: absoluteSiteUrl(config.path),
        })}
      />
      <AnimeNewsIndexContent articles={articles} />
    </>
  );
}
