"use client";

import { VideoCard } from "@/components/VideoCard";
import { useLocale } from "@/providers/LocaleProvider";
import type { Video } from "@/lib/types";

type HomeContentProps = {
  videos: Video[];
};

export function HomeContent({ videos }: HomeContentProps) {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <section className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-black sm:text-4xl dark:text-white">
          {t.home.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-600 sm:text-base dark:text-zinc-400">
          {t.home.subtitle}
        </p>
      </section>

      <section
        aria-label={t.home.gridLabel}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {videos.map((video, index) => (
          <VideoCard key={video.id} video={video} rank={index + 1} />
        ))}
      </section>
    </div>
  );
}
