"use client";

import { VideoCard } from "@/components/VideoCard";
import { useLocale } from "@/providers/LocaleProvider";
import type { Video } from "@/lib/types";

type ExclusivesChallengeVideosProps = {
  videos: Video[];
};

export function ExclusivesChallengeVideos({ videos }: ExclusivesChallengeVideosProps) {
  const { t } = useLocale();

  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          {t.exclusives.clipChallengeSectionTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-base font-medium leading-relaxed text-zinc-700 dark:text-zinc-300">
          {t.exclusives.clipChallengeSectionDesc}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} showTrendingDuelBadge />
        ))}
      </div>
    </section>
  );
}
