"use client";

import { DailyHallOfFame } from "@/components/exclusives/DailyHallOfFame";
import { RandomDuelButton } from "@/components/exclusives/RandomDuelButton";
import { VideoCard } from "@/components/VideoCard";
import { useLocale } from "@/providers/LocaleProvider";
import type { DailyHallLeader } from "@/lib/dailyHall";
import type { Video } from "@/lib/types";

type ExclusivesPageContentProps = {
  videos: Video[];
  dailyLeader: DailyHallLeader | null;
  trendingDuelIds: Set<string>;
};

export function ExclusivesPageContent({
  videos,
  dailyLeader,
  trendingDuelIds,
}: ExclusivesPageContentProps) {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white">{t.pages.exclusivesTitle}</h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-600 sm:text-base dark:text-zinc-400">
          {t.pages.exclusivesSubtitle}
        </p>
      </section>

      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        <DailyHallOfFame leader={dailyLeader} />
        <RandomDuelButton />
      </div>

      {videos.length === 0 ? (
        <p className="text-sm text-zinc-500">{t.pages.emptyExclusives}</p>
      ) : (
        <section
          aria-label={t.home.gridLabel}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              rank={video.global_rank}
              showTrendingDuelBadge={trendingDuelIds.has(video.id)}
            />
          ))}
        </section>
      )}
    </div>
  );
}
