"use client";

import { useMemo, useState } from "react";
import { VideoGridContent } from "@/components/VideoGridContent";
import { useLiveRankedVideos } from "@/hooks/useLiveRankedVideos";
import { filterVideosByQuery } from "@/lib/videoSearch";
import { useLocale } from "@/providers/LocaleProvider";
import type { Video } from "@/lib/types";

export function VideosPageContent({ videos: initialVideos }: { videos: Video[] }) {
  const { t } = useLocale();
  const [query, setQuery] = useState("");
  const videos = useLiveRankedVideos(initialVideos, { mode: "catalog" });

  const trimmedQuery = query.trim();
  const filteredVideos = useMemo(
    () => filterVideosByQuery(videos, query),
    [videos, query],
  );

  const emptyMessage = trimmedQuery
    ? t.pages.emptyVideoSearch.replace("{query}", trimmedQuery)
    : t.pages.emptyVideos;

  return (
    <VideoGridContent
      title={t.pages.videosTitle}
      videos={filteredVideos}
      emptyMessage={emptyMessage}
      showRank
      headerExtra={
        <div className="max-w-2xl">
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
          {trimmedQuery ? (
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              {t.pages.videosSearchResults.replace("{count}", String(filteredVideos.length))}
            </p>
          ) : null}
        </div>
      }
    />
  );
}
