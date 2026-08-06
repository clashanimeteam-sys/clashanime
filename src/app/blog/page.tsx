import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { BlogIndexContent } from "@/components/blog/BlogIndexContent";
import { listPublishedAnimeNews } from "@/lib/animeNews.server";
import { buildBlogHubKeywords } from "@/lib/blog/seo";
import { loadHeroesDailyPointer } from "@/lib/heroesGuideDaily.server";
import { absoluteSiteUrl } from "@/lib/siteSeo";
import { buildBlogHubJsonLd, buildPageMetadata, PAGE_SEO } from "@/lib/seoMetadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("blog", {
    extraKeywords: buildBlogHubKeywords(),
  });
}

export default async function BlogPage() {
  const config = PAGE_SEO.blog;
  const [latestNews, daily] = await Promise.all([
    listPublishedAnimeNews(5, 0),
    loadHeroesDailyPointer(),
  ]);

  return (
    <>
      <JsonLd
        data={buildBlogHubJsonLd({
          title: config.title,
          description: config.description,
          url: absoluteSiteUrl(config.path),
        })}
      />
      <BlogIndexContent latestNews={latestNews} dailyBrief={daily} />
    </>
  );
}
