import { HomeContent } from "@/components/HomeContent";
import { getActiveClashSeason } from "@/lib/clashSeasons.server";
import { getClashVideos } from "@/lib/videos";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [videos, activeSeason] = await Promise.all([getClashVideos(), getActiveClashSeason()]);

  return <HomeContent videos={videos} activeSeason={activeSeason} />;
}
