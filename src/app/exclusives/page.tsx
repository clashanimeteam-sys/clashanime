import { ExclusivesPageContent } from "@/components/ExclusivesPageContent";
import { getDailyInteractionLeader } from "@/lib/dailyHall";
import { getHallOfLegends } from "@/lib/hallOfLegends";
import { getRecentPointsWagerDuels } from "@/lib/pointsDuelsServer";

export const dynamic = "force-dynamic";

export default async function ExclusivesPage() {
  const [dailyLeader, publicWagerDuels, legendSeasons] = await Promise.all([
    getDailyInteractionLeader(),
    getRecentPointsWagerDuels(12),
    getHallOfLegends(8),
  ]);

  return (
    <ExclusivesPageContent
      dailyLeader={dailyLeader}
      publicWagerDuels={publicWagerDuels}
      legendSeasons={legendSeasons}
    />
  );
}
