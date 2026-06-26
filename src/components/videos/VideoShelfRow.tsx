"use client";

import { VideoCard } from "@/components/VideoCard";
import { getClashDisplayRank } from "@/lib/videoRanking";
import type { Video } from "@/lib/types";

type VideoShelfRowProps = {
  title: string;
  videos: Video[];
  showRank?: boolean;
  emptyMessage?: string;
};

export function VideoShelfRow({
  title,
  videos,
  showRank = false,
  emptyMessage,
}: VideoShelfRowProps) {
  if (videos.length === 0) {
    return emptyMessage ? (
      <section className="mb-10">
        <h2 className="mb-3 px-1 font-display text-lg font-bold text-zinc-900 dark:text-white sm:text-xl">
          {title}
        </h2>
        <p className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400">
          {emptyMessage}
        </p>
      </section>
    ) : null;
  }

  return (
    <section className="mb-10" aria-label={title}>
      <h2 className="mb-3 px-1 font-display text-lg font-bold text-zinc-900 dark:text-white sm:text-xl">
        {title}
      </h2>
      <div className="video-shelf-scroll -mx-1 flex gap-3 overflow-x-auto px-1 pb-2 snap-x snap-mandatory">
        {videos.map((video) => (
          <div
            key={video.id}
            className="w-[42vw] max-w-[168px] shrink-0 snap-start sm:w-[160px] md:w-[172px]"
          >
            <VideoCard
              video={video}
              rank={showRank ? getClashDisplayRank(video) : undefined}
              showClashBadge={showRank}
              compact
              feedMode="catalog"
              className="live-ranked-card h-full"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
