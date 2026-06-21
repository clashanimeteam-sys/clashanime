import { ExclusivesPageContent } from "@/components/ExclusivesPageContent";
import { getDailyInteractionLeader } from "@/lib/dailyHall";
import { getRecentPointsWagerDuels } from "@/lib/pointsDuelsServer";

export const dynamic = "force-dynamic";

export default async function ExclusivesPage() {
  const [dailyLeader, publicWagerDuels] = await Promise.all([
    getDailyInteractionLeader(),
    getRecentPointsWagerDuels(12),
  ]);

  return (
    <ExclusivesPageContent
      dailyLeader={dailyLeader}
      publicWagerDuels={publicWagerDuels}
    />
  );
}
