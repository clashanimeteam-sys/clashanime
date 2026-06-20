import { ExclusivesPageContent } from "@/components/ExclusivesPageContent";
import { buildTrendingDuelSet, enrichVideosWithRanks } from "@/lib/duel";
import { getDailyInteractionLeader } from "@/lib/dailyHall";
import { getGloballyRankedVideos, getVerifiedCreatorVideos } from "@/lib/videos";

export const dynamic = "force-dynamic";

export default async function ExclusivesPage() {
  const [videos, dailyLeader, ranked] = await Promise.all([
    getVerifiedCreatorVideos(),
    getDailyInteractionLeader(),
    getGloballyRankedVideos(),
  ]);

  const enrichedVideos = enrichVideosWithRanks(videos, ranked);
  const trendingDuelIds = buildTrendingDuelSet(enrichedVideos, ranked);

  return (
    <ExclusivesPageContent
      videos={enrichedVideos}
      dailyLeader={dailyLeader}
      trendingDuelIds={trendingDuelIds}
    />
  );
}
