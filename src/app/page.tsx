import { HomeContent } from "@/components/HomeContent";
import { getActiveClashSeason } from "@/lib/clashSeasons.server";
import { getHallOfLegends } from "@/lib/hallOfLegends";
import { getClashArenaStats, getClashVideos } from "@/lib/videos";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [videos, activeSeason, arenaStats, legendSeasons] = await Promise.all([
    getClashVideos(),
    getActiveClashSeason(),
    getClashArenaStats(),
    getHallOfLegends(4),
  ]);

  return (
    <HomeContent
      videos={videos}
      activeSeason={activeSeason}
      arenaStats={arenaStats}
      legendSeasons={legendSeasons}
    />
  );
}
