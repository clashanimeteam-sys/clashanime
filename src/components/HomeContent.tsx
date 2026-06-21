"use client";

import { ClashArenaBackdrop } from "@/components/clash/ClashArenaBackdrop";
import { ClashFireFrame } from "@/components/clash/ClashFireFrame";
import { ClashVsFlame } from "@/components/clash/ClashVsFlame";
import { SiteTitle } from "@/components/SiteTitle";
import { VideoCard } from "@/components/VideoCard";
import { useLocale } from "@/providers/LocaleProvider";
import type { Video } from "@/lib/types";

type HomeContentProps = {
  videos: Video[];
};

const PODIUM_ORDER = [2, 1, 3] as const;

export function HomeContent({ videos }: HomeContentProps) {
  const { t } = useLocale();

  const podiumVideos = PODIUM_ORDER.map((rank) =>
    videos.find((video) => video.global_rank === rank),
  ).filter((video): video is Video => Boolean(video));

  const challengerVideos = videos.filter(
    (video) => video.global_rank !== undefined && video.global_rank > 3,
  );

  function renderClashCard(video: Video, elevated = false) {
    const card = (
      <VideoCard
        video={video}
        rank={video.global_rank}
        clashMode
        showClashBadge
        clashRivalFlameSide={
          video.global_rank === 1 ? "start" : video.global_rank === 2 ? "end" : undefined
        }
      />
    );

    if (video.global_rank === undefined) return card;

    return (
      <ClashFireFrame rank={video.global_rank}>
        <div className={elevated ? "lg:-translate-y-2 lg:scale-[1.03]" : undefined}>
          {card}
        </div>
      </ClashFireFrame>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <ClashArenaBackdrop />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <section className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-orange-700 backdrop-blur-sm dark:text-orange-300">
            <span className="h-2 w-2 animate-[live-dot_1.2s_ease-in-out_infinite] rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.9)]" />
            {t.home.clashLive}
          </div>

          <SiteTitle
            primary={t.home.titlePrimary}
            secondary={t.home.titleSecondary}
          />
          <p className="mt-3 max-w-2xl text-sm text-zinc-700 sm:text-base dark:text-zinc-300">
            {t.home.subtitle}
          </p>
        </section>

        {podiumVideos.length > 0 ? (
          <section aria-label={t.home.podiumLabel} className="mb-10">
            <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.24em] text-orange-600 dark:text-orange-400">
              {t.home.podiumLabel}
            </h2>
            <div className="relative">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:items-end">
                {podiumVideos.map((video) =>
                  renderClashCard(video, video.global_rank === 1),
                )}
              </div>
              {podiumVideos.some((video) => video.global_rank === 1) &&
              podiumVideos.some((video) => video.global_rank === 2) ? (
                <ClashVsFlame className="absolute left-1/3 top-0 z-20 hidden -translate-x-1/2 -translate-y-1/2 sm:flex" />
              ) : null}
            </div>
          </section>
        ) : null}

        {challengerVideos.length > 0 ? (
          <section aria-label={t.home.challengersLabel}>
            <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.24em] text-red-700 dark:text-red-400">
              {t.home.challengersLabel}
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {challengerVideos.map((video) => renderClashCard(video))}
            </div>
          </section>
        ) : null}

        {videos.length === 0 ? (
          <p className="text-sm text-zinc-500">{t.pages.emptyVideos}</p>
        ) : null}

        {podiumVideos.length === 0 && challengerVideos.length === 0 && videos.length > 0 ? (
          <section
            aria-label={t.home.gridLabel}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {videos.map((video) => renderClashCard(video))}
          </section>
        ) : null}
      </div>
    </div>
  );
}
