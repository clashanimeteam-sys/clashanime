import { RandomDuelContent } from "@/components/exclusives/RandomDuelContent";
import { pickRandomDuelPair } from "@/lib/duel";
import { getGloballyRankedVideos } from "@/lib/videos";

export const dynamic = "force-dynamic";

export default async function RandomDuelPage() {
  const videos = await getGloballyRankedVideos();
  const pair = pickRandomDuelPair(videos);
  return <RandomDuelContent pair={pair} />;
}
