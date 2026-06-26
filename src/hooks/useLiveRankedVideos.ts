"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import {
  applyLiveRanking,
  patchVideoEngagement,
  patchVideoFromRow,
  type LiveRankingMode,
} from "@/lib/liveVideoRanking";
import {
  VIDEO_ENGAGEMENT_CHANGED,
  type VideoEngagementDelta,
} from "@/lib/videoEngagementEvents";
import type { Video } from "@/lib/types";

const REFETCH_DEBOUNCE_MS = 400;

type UseLiveRankedVideosOptions = {
  mode: LiveRankingMode;
};

export function useLiveRankedVideos(initialVideos: Video[], { mode }: UseLiveRankedVideosOptions) {
  const supabase = useMemo(() => createBrowserClient(), []);
  const [videos, setVideos] = useState(() => applyLiveRanking(initialVideos, mode));
  const poolRef = useRef<Video[]>(initialVideos);
  const refetchTimerRef = useRef<number | null>(null);

  const recompute = useCallback(
    (pool: Video[]) => {
      poolRef.current = pool;
      setVideos(applyLiveRanking(pool, mode));
    },
    [mode],
  );

  useEffect(() => {
    poolRef.current = initialVideos;
    setVideos(applyLiveRanking(initialVideos, mode));
  }, [initialVideos, mode]);

  const scheduleRefetch = useCallback(() => {
    if (typeof window === "undefined") return;

    if (refetchTimerRef.current !== null) {
      window.clearTimeout(refetchTimerRef.current);
    }

    refetchTimerRef.current = window.setTimeout(() => {
      refetchTimerRef.current = null;
      void fetch(`/api/videos/live-pool?mode=${mode}`, { cache: "no-store" })
        .then((response) => (response.ok ? response.json() : null))
        .then((next) => {
          if (!Array.isArray(next) || next.length === 0) return;
          recompute(next as Video[]);
        })
        .catch(() => {
          // Keep the last known pool when refetch fails.
        });
    }, REFETCH_DEBOUNCE_MS);
  }, [mode, recompute]);

  useEffect(() => {
    function onEngagement(event: Event) {
      const delta = (event as CustomEvent<VideoEngagementDelta>).detail;
      if (!delta?.videoId) return;
      recompute(patchVideoEngagement(poolRef.current, delta));
    }

    window.addEventListener(VIDEO_ENGAGEMENT_CHANGED, onEngagement);
    return () => window.removeEventListener(VIDEO_ENGAGEMENT_CHANGED, onEngagement);
  }, [recompute]);

  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel("live-video-ranking")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "videos" },
        (payload) => {
          const row = payload.new as {
            id: string;
            likes_count?: number;
            comments_count?: number;
            views_count?: number;
            shares_count?: number;
            moderation_status?: string;
          };

          if (row.moderation_status && row.moderation_status !== "approved") {
            scheduleRefetch();
            return;
          }

          if (poolRef.current.some((video) => video.id === row.id)) {
            recompute(patchVideoFromRow(poolRef.current, row));
            return;
          }

          scheduleRefetch();
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "videos" },
        () => {
          scheduleRefetch();
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "videos" },
        (payload) => {
          const row = payload.old as { id?: string };
          if (!row.id) {
            scheduleRefetch();
            return;
          }
          recompute(poolRef.current.filter((video) => video.id !== row.id));
        },
      )
      .subscribe();

    return () => {
      if (refetchTimerRef.current !== null) {
        window.clearTimeout(refetchTimerRef.current);
      }
      void supabase.removeChannel(channel);
    };
  }, [supabase, recompute, scheduleRefetch]);

  return videos;
}
