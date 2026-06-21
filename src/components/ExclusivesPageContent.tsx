"use client";

import { ClipChallengeCard } from "@/components/exclusives/ClipChallengeCard";
import { DailyHallOfFame } from "@/components/exclusives/DailyHallOfFame";
import { PointsWagerSection } from "@/components/exclusives/PointsWagerSection";
import { useLocale } from "@/providers/LocaleProvider";
import type { DailyHallLeader } from "@/lib/dailyHall";
import type { PointsWagerDuelRow } from "@/lib/pointsDuels";

type ExclusivesPageContentProps = {
  dailyLeader: DailyHallLeader | null;
  publicWagerDuels: PointsWagerDuelRow[];
};

export function ExclusivesPageContent({
  dailyLeader,
  publicWagerDuels,
}: ExclusivesPageContentProps) {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <section className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-black dark:text-white sm:text-4xl">
          {t.pages.exclusivesTitle}
        </h1>
        <p className="mt-3 max-w-2xl text-base font-medium leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-lg">
          {t.pages.exclusivesSubtitle}
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <DailyHallOfFame leader={dailyLeader} />
        <PointsWagerSection publicDuels={publicWagerDuels} />
      </div>

      <div className="mt-4">
        <ClipChallengeCard />
      </div>
    </div>
  );
}
