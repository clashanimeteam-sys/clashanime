import { notFound } from "next/navigation";
import { AnimeWatchNowDetailContent } from "@/components/blog/AnimeWatchNowDetailContent";
import { JsonLd } from "@/components/JsonLd";
import { loadWatchNowCatalog } from "@/lib/animeNews/watchNow.server";
import { watchNowAnimePath } from "@/lib/animeNews/watchNowPaths";
import { absoluteSiteUrl } from "@/lib/siteSeo";
import { buildBlogHubJsonLd, buildPageMetadata } from "@/lib/seoMetadata";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ key: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { key } = await params;
  const catalog = await loadWatchNowCatalog();
  const entry = catalog.find((item) => item.key === decodeURIComponent(key));

  if (!entry) {
    return buildPageMetadata("animeNews", {
      title: "Watch Now — ClashAnime",
      path: watchNowAnimePath(key),
    });
  }

  const synopsis = entry.synopsis?.slice(0, 155) ?? entry.title;

  return buildPageMetadata("animeNews", {
    title: `${entry.title} — Watch Now — ClashAnime`,
    description: synopsis,
    path: watchNowAnimePath(entry.key),
    image: entry.posterUrl ?? undefined,
  });
}

export default async function AnimeWatchNowDetailPage({ params }: PageProps) {
  const { key } = await params;
  const decodedKey = decodeURIComponent(key);
  const catalog = await loadWatchNowCatalog();
  const entry = catalog.find((item) => item.key === decodedKey);

  if (!entry) notFound();

  return (
    <>
      <JsonLd
        data={buildBlogHubJsonLd({
          title: entry.title,
          description: entry.synopsis ?? entry.title,
          url: absoluteSiteUrl(watchNowAnimePath(entry.key)),
        })}
      />
      <AnimeWatchNowDetailContent entry={entry} />
    </>
  );
}
