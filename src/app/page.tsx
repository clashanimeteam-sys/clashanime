import { HomeContent } from "@/components/HomeContent";
import { getActiveAnimeReleaseClashes } from "@/lib/animeTracker.server";
import { getActiveClashSeason } from "@/lib/clashSeasons.server";
import { getHallOfLegends } from "@/lib/hallOfLegends";
import { getClashArenaStats, getClashVideos } from "@/lib/videos";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [videos, activeSeason, arenaStats, legendSeasons, activeReleaseClashes] = await Promise.all([
    getClashVideos(),
    getActiveClashSeason(),
    getClashArenaStats(),
    getHallOfLegends(4),
    getActiveAnimeReleaseClashes(),
  ]);

  return (
    <HomeContent
      videos={videos}
      activeSeason={activeSeason}
      arenaStats={arenaStats}
      legendSeasons={legendSeasons}
      activeReleaseClashes={activeReleaseClashes}
    />
  );
}
