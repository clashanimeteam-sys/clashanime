import type { Metadata } from "next";
import { ExclusivesPageContent } from "@/components/ExclusivesPageContent";
import { getAnimeSeoCatalog } from "@/lib/animeTracker.server";
import { buildPageMetadata } from "@/lib/seoMetadata";
import { getDailyInteractionLeader } from "@/lib/dailyHall";
import { getHallOfLegends } from "@/lib/hallOfLegends";
import { getRecentPointsWagerDuels } from "@/lib/pointsDuelsServer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const catalog = await getAnimeSeoCatalog();
  return buildPageMetadata("exclusives", { dbAnime: catalog });
}

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
