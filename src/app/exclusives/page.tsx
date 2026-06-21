import { ExclusivesPageContent } from "@/components/ExclusivesPageContent";
import { getDailyInteractionLeader } from "@/lib/dailyHall";
import { getRecentVideos, getVerifiedCreatorVideos } from "@/lib/videos";

export const dynamic = "force-dynamic";

export default async function ExclusivesPage() {
  const [dailyLeader, verifiedVideos, recentVideos] = await Promise.all([
    getDailyInteractionLeader(),
    getVerifiedCreatorVideos(12),
    getRecentVideos(12),
  ]);

  const challengeVideos = verifiedVideos.length > 0 ? verifiedVideos : recentVideos;

  return (
    <ExclusivesPageContent dailyLeader={dailyLeader} challengeVideos={challengeVideos} />
  );
}
