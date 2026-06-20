"use client";

import { SiteTitle } from "@/components/SiteTitle";
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
        <SiteTitle
          primary={t.home.titlePrimary}
          secondary={t.home.titleSecondary}
        />
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
