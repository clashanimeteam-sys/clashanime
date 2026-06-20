"use client";

import { VideoCard } from "@/components/VideoCard";
import { useLocale } from "@/providers/LocaleProvider";
import type { Video } from "@/lib/types";

type VideoGridContentProps = {
  title: string;
  subtitle: string;
  videos: Video[];
  emptyMessage: string;
  showRank?: boolean;
};

export function VideoGridContent({
  title,
  subtitle,
  videos,
  emptyMessage,
  showRank = false,
}: VideoGridContentProps) {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-600 sm:text-base dark:text-zinc-400">
          {subtitle}
        </p>
      </section>

      {videos.length === 0 ? (
        <p className="text-sm text-zinc-500">{emptyMessage}</p>
      ) : (
        <section
          aria-label={t.home.gridLabel}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {videos.map((video, index) => (
            <VideoCard
              key={video.id}
              video={video}
              rank={showRank ? index + 1 : undefined}
            />
          ))}
        </section>
      )}
    </div>
  );
}
