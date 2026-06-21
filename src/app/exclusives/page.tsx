import { ExclusivesPageContent } from "@/components/ExclusivesPageContent";
import { getDailyInteractionLeader } from "@/lib/dailyHall";

export const dynamic = "force-dynamic";

export default async function ExclusivesPage() {
  const dailyLeader = await getDailyInteractionLeader();
  return <ExclusivesPageContent dailyLeader={dailyLeader} />;
}
