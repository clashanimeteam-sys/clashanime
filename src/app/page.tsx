import type { Metadata } from "next";
import { HomeContent } from "@/components/HomeContent";
import { JsonLd } from "@/components/JsonLd";
import {
  buildOrganizationJsonLd,
  buildPageMetadata,
  buildWebSiteJsonLd,
} from "@/lib/seoMetadata";
import { getActiveAnimeReleaseClashes, getAnimeSeoCatalog } from "@/lib/animeTracker.server";
import { getActiveClashSeason } from "@/lib/clashSeasons.server";
import { getHallOfLegends } from "@/lib/hallOfLegends";
import { getApprovedVideoPool, getClashArenaStats, getClashVideos } from "@/lib/videos";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const catalog = await getAnimeSeoCatalog();
  return buildPageMetadata("home", { dbAnime: catalog });
}

export default async function Home() {
  const [, rankedPool, activeSeason, arenaStats, legendSeasons, activeReleaseClashes] =
    await Promise.all([
      getClashVideos(),
      getApprovedVideoPool(),
      getActiveClashSeason(),
      getClashArenaStats(),
      getHallOfLegends(4),
      getActiveAnimeReleaseClashes(),
    ]);

  return (
    <>
      <JsonLd data={[buildWebSiteJsonLd(), buildOrganizationJsonLd()]} />
      <HomeContent
        rankedPool={rankedPool}
        activeSeason={activeSeason}
        arenaStats={arenaStats}
        legendSeasons={legendSeasons}
        activeReleaseClashes={activeReleaseClashes}
      />
    </>
  );
}
