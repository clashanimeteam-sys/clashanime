import { ExclusivesPageContent } from "@/components/ExclusivesPageContent";
import { getDailyInteractionLeader } from "@/lib/dailyHall";
import { getRecentPointsWagerDuels } from "@/lib/pointsDuelsServer";
import { getRecentVideos, getVerifiedCreatorVideos } from "@/lib/videos";

export const dynamic = "force-dynamic";

export default async function ExclusivesPage() {
  const [dailyLeader, verifiedVideos, recentVideos, publicWagerDuels] = await Promise.all([
    getDailyInteractionLeader(),
    getVerifiedCreatorVideos(12),
    getRecentVideos(12),
    getRecentPointsWagerDuels(12),
  ]);

  const challengeVideos = verifiedVideos.length > 0 ? verifiedVideos : recentVideos;

  return (
    <ExclusivesPageContent
      dailyLeader={dailyLeader}
      challengeVideos={challengeVideos}
      publicWagerDuels={publicWagerDuels}
    />
  );
}
