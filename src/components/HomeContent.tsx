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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {t.home.eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t.home.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">
          {t.home.subtitle}
        </p>
        <p className="mt-2 text-xs font-medium text-accent/80">
          {t.home.liveNote}
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
