"use client";

import { VideoCard } from "@/components/VideoCard";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";
import type { Video } from "@/lib/types";

type VideoGridContentProps = {
  title: string;
  subtitle?: string;
  videos: Video[];
  emptyMessage: string;
  showRank?: boolean;
  headerExtra?: React.ReactNode;
};

export function VideoGridContent({
  title,
  subtitle,
  videos,
  emptyMessage,
  showRank = false,
  headerExtra,
}: VideoGridContentProps) {
  const { t } = useLocale();
  usePageTitle(title);

  return (
    <div className="mx-auto max-w-[1920px] px-4 py-4 sm:px-6">
      {(subtitle || headerExtra) ? (
        <section className="mb-6">
          {subtitle ? (
            <p className="max-w-2xl text-sm text-zinc-600 sm:text-base dark:text-zinc-400">
              {subtitle}
            </p>
          ) : null}
          {headerExtra ? <div className={subtitle ? "mt-4" : ""}>{headerExtra}</div> : null}
        </section>
      ) : null}

      {videos.length === 0 ? (
        <p className="text-sm text-zinc-500">{emptyMessage}</p>
      ) : (
        <section
          aria-label={t.home.gridLabel}
          className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
        >
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              rank={showRank ? video.global_rank : undefined}
              showClashBadge={showRank}
              compact
              feedMode="catalog"
            />
          ))}
        </section>
      )}
    </div>
  );
}
