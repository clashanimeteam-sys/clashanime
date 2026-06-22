"use client";

import { ClashPrizeBanner } from "@/components/clash/ClashPrizeBanner";
import { ClashVideosBackdrop } from "@/components/clash/ClashVideosBackdrop";
import { SeasonCountdown } from "@/components/clash/SeasonCountdown";
import { SiteTitle } from "@/components/SiteTitle";
import { VideoCard } from "@/components/VideoCard";
import type { ClashSeason } from "@/lib/clashSeasons";
import { useLocale } from "@/providers/LocaleProvider";
import type { Video } from "@/lib/types";

type HomeContentProps = {
  videos: Video[];
  activeSeason: ClashSeason | null;
};

const PODIUM_ORDER = [1, 2, 3] as const;

export function HomeContent({ videos, activeSeason }: HomeContentProps) {
  const { t } = useLocale();

  const podiumVideos = PODIUM_ORDER.map((rank) =>
    videos.find((video) => video.global_rank === rank),
  ).filter((video): video is Video => Boolean(video));

  const challengerVideos = videos
    .filter((video) => video.global_rank !== undefined && video.global_rank > 3)
    .sort((a, b) => (a.global_rank ?? 0) - (b.global_rank ?? 0));

  function renderClashCard(video: Video) {
    return (
      <VideoCard
        video={video}
        rank={video.global_rank}
        clashMode
        showClashBadge
        feedMode="clash"
      />
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div
        className={`relative z-10 mx-auto max-w-7xl px-4 py-4 sm:px-6 ${activeSeason ? "pt-36 sm:pt-4" : ""}`}
      >
        {activeSeason ? <SeasonCountdown season={activeSeason} /> : null}

        <section className="mb-8">
          <SiteTitle
            primary={t.home.titlePrimary}
            secondary={t.home.titleSecondary}
          />
          <p className="mt-3 max-w-2xl text-sm text-zinc-700 sm:text-base dark:text-zinc-300">
            {t.home.subtitle}
          </p>
        </section>

        <ClashPrizeBanner activeSeason={activeSeason} />

        <div className="relative overflow-hidden rounded-3xl border border-orange-500/20 shadow-[0_24px_80px_rgba(127,29,29,0.18)]">
          <ClashVideosBackdrop />

          <div className="relative z-10 px-4 py-6 sm:px-6 sm:py-8">
            {podiumVideos.length > 0 ? (
              <section aria-label={t.home.podiumLabel} className="mb-10">
                <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.24em] text-amber-200">
                  {t.home.podiumLabel}
                </h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:items-start">
                  {podiumVideos.map((video) => renderClashCard(video))}
                </div>
              </section>
            ) : null}

            {challengerVideos.length > 0 ? (
              <section aria-label={t.home.challengersLabel}>
                <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.24em] text-orange-200">
                  {t.home.challengersLabel}
                </h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {challengerVideos.map((video) => renderClashCard(video))}
                </div>
              </section>
            ) : null}

            {videos.length === 0 ? (
              <p className="text-sm text-amber-100/80">{t.pages.emptyVideos}</p>
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
      </div>
    </div>
  );
}
