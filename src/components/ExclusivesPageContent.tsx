"use client";

import { ClipChallengeCard } from "@/components/exclusives/ClipChallengeCard";
import { DailyHallOfFame } from "@/components/exclusives/DailyHallOfFame";
import { HallOfLegends } from "@/components/exclusives/HallOfLegends";
import { PointsWagerSection } from "@/components/exclusives/PointsWagerSection";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";
import type { DailyHallLeader } from "@/lib/dailyHall";
import type { HallOfLegendsSeason } from "@/lib/hallOfLegends";
import type { PointsWagerDuelRow } from "@/lib/pointsDuels";

type ExclusivesPageContentProps = {
  dailyLeader: DailyHallLeader | null;
  publicWagerDuels: PointsWagerDuelRow[];
  legendSeasons: HallOfLegendsSeason[];
};

export function ExclusivesPageContent({
  dailyLeader,
  publicWagerDuels,
  legendSeasons,
}: ExclusivesPageContentProps) {
  const { t } = useLocale();
  usePageTitle(t.pages.exclusivesTitle);

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
      <section className="mb-6">
        <p className="max-w-2xl text-base font-medium leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-lg">
          {t.pages.exclusivesSubtitle}
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <DailyHallOfFame leader={dailyLeader} />
        <PointsWagerSection publicDuels={publicWagerDuels} />
      </div>

      <div className="mt-4">
        <HallOfLegends seasons={legendSeasons} />
      </div>

      <div className="mt-4">
        <ClipChallengeCard />
      </div>
    </div>
  );
}
