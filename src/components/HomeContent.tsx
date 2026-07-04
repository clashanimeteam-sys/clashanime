"use client";

import { InstantEpisodeClashBanner } from "@/components/clash/InstantEpisodeClashBanner";
import { AdPlacementBanner } from "@/components/ads/AdPlacementBanner";
import { LiveClashCounter } from "@/components/clash/LiveClashCounter";
import { ClashPrizeBanner } from "@/components/clash/ClashPrizeBanner";
import { ClashVideosBackdrop } from "@/components/clash/ClashVideosBackdrop";
import { SeasonCountdown } from "@/components/clash/SeasonCountdown";
import { HallOfLegends } from "@/components/exclusives/HallOfLegends";
import { VideoCard } from "@/components/VideoCard";
import type { ClashSeason } from "@/lib/clashSeasons";
import type { HallOfLegendsSeason } from "@/lib/hallOfLegends";
import type { AnimeReleaseClash } from "@/lib/animeTracker";
import type { ClashArenaStats } from "@/lib/videos";
import { useLocale } from "@/providers/LocaleProvider";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useLiveRankedVideos } from "@/hooks/useLiveRankedVideos";
import type { Video } from "@/lib/types";

type HomeContentProps = {
  rankedPool: Video[];
  activeSeason: ClashSeason | null;
  arenaStats: ClashArenaStats;
  legendSeasons: HallOfLegendsSeason[];
  activeReleaseClashes: AnimeReleaseClash[];
};

const PODIUM_ORDER_DESKTOP = [1, 2, 3] as const;
const PODIUM_ORDER_MOBILE = [1, 2, 3, 4] as const;

function HomeHeroTop({
  activeSeason,
  arenaStats,
}: {
  activeSeason: ClashSeason | null;
  arenaStats: ClashArenaStats;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="-ms-4 hidden self-start md:block sm:-ms-6">
        <LiveClashCounter initialStats={arenaStats} />
      </div>
      {activeSeason ? (
        <div className="self-end sm:self-auto">
          <SeasonCountdown season={activeSeason} className="shrink-0" />
        </div>
      ) : null}
    </div>
  );
}

export function HomeContent({
  rankedPool,
  activeSeason,
  arenaStats,
  legendSeasons,
  activeReleaseClashes,
}: HomeContentProps) {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const videos = useLiveRankedVideos(rankedPool, { mode: "clash" });
  const hasReleaseBanner = activeReleaseClashes.length > 0;

  const podiumRanks = isMobile ? PODIUM_ORDER_MOBILE : PODIUM_ORDER_DESKTOP;
  const podiumVideos = podiumRanks
    .map((rank) => videos.find((video) => video.global_rank === rank))
    .filter((video): video is Video => Boolean(video));

  const challengerVideos = videos
    .filter((video) => video.global_rank !== undefined && video.global_rank > podiumRanks.length)
    .sort((a, b) => (a.global_rank ?? 0) - (b.global_rank ?? 0));

  function renderClashCard(video: Video, options?: { compact?: boolean }) {
    return (
      <VideoCard
        key={video.id}
        video={video}
        rank={video.global_rank}
        clashMode
        showClashBadge
        feedMode="clash"
        compact={options?.compact}
        className="live-ranked-card"
      />
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-4 pt-1 sm:px-6">
        {hasReleaseBanner ? (
          <div className="mb-8 flex flex-col gap-4">
            <HomeHeroTop activeSeason={activeSeason} arenaStats={arenaStats} />
            <InstantEpisodeClashBanner clashes={activeReleaseClashes} />
          </div>
        ) : (
          <section className="mb-8">
            <HomeHeroTop activeSeason={activeSeason} arenaStats={arenaStats} />
          </section>
        )}

        <ClashPrizeBanner activeSeason={activeSeason} />

        <AdPlacementBanner page="home" className="mb-8" />

        {legendSeasons.length > 0 ? (
          <section className="mb-8">
            <HallOfLegends seasons={legendSeasons.slice(0, 2)} compact />
          </section>
        ) : null}

        <div className="relative overflow-hidden rounded-3xl border border-orange-500/20 shadow-[0_24px_80px_rgba(127,29,29,0.18)]">
          <ClashVideosBackdrop />

          <div className="relative z-10 px-4 py-6 sm:px-6 sm:py-8">
            {podiumVideos.length > 0 ? (
              <section aria-label={t.home.podiumLabel} className="mb-10" aria-live="polite">
                <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.24em] text-amber-200">
                  {t.home.podiumLabel}
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 sm:items-start">
                  {podiumVideos.map((video) => renderClashCard(video, { compact: isMobile }))}
                </div>
              </section>
            ) : null}

            {challengerVideos.length > 0 ? (
              <section aria-label={t.home.challengersLabel} aria-live="polite">
                <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.24em] text-orange-200">
                  {t.home.challengersLabel}
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5">
                  {challengerVideos.map((video) => renderClashCard(video, { compact: isMobile }))}
                </div>
              </section>
            ) : null}

            {videos.length === 0 ? (
              <p className="text-sm text-amber-100/80">{t.pages.emptyVideos}</p>
            ) : null}

            {podiumVideos.length === 0 && challengerVideos.length === 0 && videos.length > 0 ? (
              <section
                aria-label={t.home.gridLabel}
                className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5"
              >
                {videos.map((video) => renderClashCard(video, { compact: isMobile }))}
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
