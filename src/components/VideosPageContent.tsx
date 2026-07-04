"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimeReleaseShelfRow } from "@/components/videos/AnimeReleaseShelfRow";
import { AdPlacementBanner } from "@/components/ads/AdPlacementBanner";
import { DuelShelfRow } from "@/components/videos/DuelShelfRow";
import { VideoShelfRow } from "@/components/videos/VideoShelfRow";
import { useLiveRankedVideos } from "@/hooks/useLiveRankedVideos";
import type { AnimeRelease, AnimeReleaseUpcoming } from "@/lib/animeTracker";
import { filterVideosByQuery } from "@/lib/videoSearch";
import type { VideoDuelRecord } from "@/lib/videoDuelsServer";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";
import type { Video } from "@/lib/types";

const SHELF_LIMIT = 20;

type VideosPageContentProps = {
  videos: Video[];
  recentAnimeReleases: AnimeRelease[];
  upcomingAnimeReleases: AnimeReleaseUpcoming[];
  recentDuels: VideoDuelRecord[];
};

export function VideosPageContent({
  videos: initialVideos,
  recentAnimeReleases,
  upcomingAnimeReleases,
  recentDuels,
}: VideosPageContentProps) {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const videos = useLiveRankedVideos(initialVideos, { mode: "catalog" });

  usePageTitle(t.pages.videosTitle);

  const trimmedQuery = query.trim();
  const isSearching = trimmedQuery.length > 0;

  const newVideos = useMemo(
    () =>
      [...videos]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, SHELF_LIMIT),
    [videos],
  );

  const trendingVideos = useMemo(
    () =>
      [...videos]
        .sort((a, b) => (b.trending_score ?? 0) - (a.trending_score ?? 0))
        .slice(0, SHELF_LIMIT),
    [videos],
  );

  const filteredVideos = useMemo(
    () => filterVideosByQuery(videos, query),
    [videos, query],
  );

  return (
    <div className="mx-auto max-w-[1920px] px-4 py-4 sm:px-6">
      <header className="mb-8">
        <h1 className="font-display text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
          {t.pages.videosTitle}
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-zinc-600 sm:text-base dark:text-zinc-400">
          {t.pages.videosSubtitle}
        </p>
        <div className="mt-5 max-w-2xl">
          <label htmlFor="videos-anime-search" className="sr-only">
            {t.pages.videosSearchPlaceholder}
          </label>
          <input
            id="videos-anime-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.pages.videosSearchPlaceholder}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-zinc-400 focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-500"
          />
        </div>
      </header>

      {isSearching ? (
        <VideoShelfRow
          title={t.videosPage.searchResultsTitle}
          videos={filteredVideos}
          showRank
          emptyMessage={t.pages.emptyVideoSearch.replace("{query}", trimmedQuery)}
        />
      ) : (
        <>
          <VideoShelfRow
            title={t.videosPage.shelfNew}
            videos={newVideos}
            showRank
            emptyMessage={t.pages.emptyVideos}
          />
          <VideoShelfRow
            title={t.videosPage.shelfTrending}
            videos={trendingVideos}
            showRank
            emptyMessage={t.pages.emptyVideos}
          />
          <AdPlacementBanner page="videos" className="mb-10" />
          <AnimeReleaseShelfRow
            title={t.videosPage.shelfLatestAnime}
            releases={recentAnimeReleases}
            badge={t.videosPage.newBadge}
            emptyMessage={t.animeTracker.noToday}
          />
          <AnimeReleaseShelfRow
            title={t.videosPage.shelfComingSoon}
            releases={upcomingAnimeReleases}
            badge={t.videosPage.comingSoonBadge}
            emptyMessage={t.animeTracker.noUpcoming}
          />
          <DuelShelfRow
            title={t.videosPage.shelfUserDuels}
            duels={recentDuels}
            emptyMessage={t.videosPage.emptyDuels}
          />
        </>
      )}
    </div>
  );
}
