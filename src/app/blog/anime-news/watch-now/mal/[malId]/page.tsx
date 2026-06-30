import { notFound, redirect } from "next/navigation";
import { AnimeWatchNowDetailContent } from "@/components/blog/AnimeWatchNowDetailContent";
import { JsonLd } from "@/components/JsonLd";
import { jikanDetailToFeaturedEntry } from "@/lib/animeNews/jikanToFeaturedEntry";
import { watchNowMalPath } from "@/lib/animeNews/heroGuidePaths";
import { watchNowAnimePath } from "@/lib/animeNews/watchNowPaths";
import { loadWatchNowCatalog } from "@/lib/animeNews/watchNow.server";
import { fetchJikanAnimeDetail } from "@/lib/jikan";
import { absoluteSiteUrl } from "@/lib/siteSeo";
import { buildBlogHubJsonLd, buildPageMetadata } from "@/lib/seoMetadata";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ malId: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { malId: malIdRaw } = await params;
  const malId = Number(malIdRaw);
  if (!Number.isFinite(malId) || malId <= 0) {
    return buildPageMetadata("animeNews", {
      title: "Watch Now — ClashAnime",
      path: watchNowMalPath(Number(malIdRaw) || 0),
    });
  }

  const detail = await fetchJikanAnimeDetail(malId);
  if (!detail) {
    return buildPageMetadata("animeNews", {
      title: "Watch Now — ClashAnime",
      path: watchNowMalPath(malId),
    });
  }

  const synopsis = detail.synopsis?.slice(0, 155) ?? detail.title;

  return buildPageMetadata("animeNews", {
    title: `${detail.title} — Heroes Guide — ClashAnime`,
    description: synopsis,
    path: watchNowMalPath(malId),
    image: detail.posterUrl ?? undefined,
  });
}

export default async function AnimeWatchNowMalPage({ params }: PageProps) {
  const { malId: malIdRaw } = await params;
  const malId = Number(malIdRaw);
  if (!Number.isFinite(malId) || malId <= 0) {
    notFound();
  }

  const catalog = await loadWatchNowCatalog();
  const catalogEntry = catalog.find((item) => item.malId === malId);
  if (catalogEntry) {
    redirect(watchNowAnimePath(catalogEntry.key));
  }

  const detail = await fetchJikanAnimeDetail(malId);
  if (!detail) {
    notFound();
  }

  const entry = jikanDetailToFeaturedEntry(detail);

  return (
    <>
      <JsonLd
        data={buildBlogHubJsonLd({
          title: entry.title,
          description: entry.synopsis ?? entry.title,
          url: absoluteSiteUrl(watchNowMalPath(malId)),
        })}
      />
      <AnimeWatchNowDetailContent entry={entry} />
    </>
  );
}
