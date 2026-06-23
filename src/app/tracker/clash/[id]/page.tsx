import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnimeReleaseClashPageContent } from "@/components/tracker/AnimeReleaseClashPageContent";
import { JsonLd } from "@/components/JsonLd";
import {
  absoluteSiteUrl,
} from "@/lib/siteSeo";
import {
  buildAnimeClashJsonLd,
  buildPageMetadata,
} from "@/lib/seoMetadata";
import {
  getAnimeReleaseClashDetail,
  getAnimeReleaseClashVideos,
} from "@/lib/animeTracker.server";

export const dynamic = "force-dynamic";

type AnimeReleaseClashPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: AnimeReleaseClashPageProps): Promise<Metadata> {
  const { id } = await params;
  const clash = await getAnimeReleaseClashDetail(id);
  if (!clash) {
    return { title: "Anime Release Clash" };
  }

  const title = `${clash.animeTitle} Episode ${clash.episodeNumber} — Release Clash`;
  const description = `Join the ${clash.animeTitle} ep ${clash.episodeNumber} release clash on Clash Anime. Upload clips with ${clash.matchTags.map((tag) => `#${tag}`).join(" ")} and compete for ClashCoins — مسابقة حلقة انمي — アニメ新作対戦.`;
  const path = `/tracker/clash/${id}`;

  return buildPageMetadata("tracker", {
    title,
    description,
    path,
    dbAnime: [
      {
        en: clash.animeTitle,
        ar: clash.titleAr ?? undefined,
        ja: clash.titleJa ?? undefined,
      },
    ],
    extraKeywords: [clash.clashTitle, ...clash.matchTags].filter((value): value is string =>
      Boolean(value?.trim()),
    ),
  });
}

export default async function AnimeReleaseClashPage({ params }: AnimeReleaseClashPageProps) {
  const { id } = await params;
  const [clash, videos] = await Promise.all([
    getAnimeReleaseClashDetail(id),
    getAnimeReleaseClashVideos(id, 24),
  ]);

  if (!clash) notFound();

  const clashUrl = absoluteSiteUrl(`/tracker/clash/${id}`);
  const clashTitle = `${clash.animeTitle} Episode ${clash.episodeNumber} Release Clash`;
  const clashDescription = `Anime release clash for ${clash.animeTitle} episode ${clash.episodeNumber}. Tags: ${clash.matchTags.join(", ")}.`;

  return (
    <>
      <JsonLd
        data={buildAnimeClashJsonLd({
          title: clashTitle,
          description: clashDescription,
          url: clashUrl,
          image: clash.posterUrl,
        })}
      />
      <AnimeReleaseClashPageContent clash={clash} videos={videos} />
    </>
  );
}
