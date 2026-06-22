import { HomeContent } from "@/components/HomeContent";
import { getActiveClashSeason } from "@/lib/clashSeasons.server";
import { getClashArenaStats, getClashVideos } from "@/lib/videos";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [videos, activeSeason, arenaStats] = await Promise.all([
    getClashVideos(),
    getActiveClashSeason(),
    getClashArenaStats(),
  ]);

  return <HomeContent videos={videos} activeSeason={activeSeason} arenaStats={arenaStats} />;
}
