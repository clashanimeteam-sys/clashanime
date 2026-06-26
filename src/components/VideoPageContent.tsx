"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BackArrowIcon } from "@/components/PageBackLink";
import { VideoSlide } from "@/components/VideoSlide";
import { CLASH_TOP_COUNT } from "@/lib/videoRanking";
import { useLocale } from "@/providers/LocaleProvider";
import type { Video } from "@/lib/types";

export type VideoFeedMode = "clash" | "catalog";

type VideoPageContentProps = {
  video: Video;
  feed: Video[];
  feedMode: VideoFeedMode;
};

function sortClashFeed(videos: Video[]): Video[] {
  return [...videos]
    .filter((item) => typeof item.global_rank === "number" && item.global_rank <= CLASH_TOP_COUNT)
    .sort((a, b) => (a.global_rank ?? 999) - (b.global_rank ?? 999))
    .slice(0, CLASH_TOP_COUNT);
}

function sortCatalogFeed(videos: Video[]): Video[] {
  return [...videos].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

function buildFeed(current: Video, feed: Video[], feedMode: VideoFeedMode): Video[] {
  const sorted =
    feedMode === "clash" ? sortClashFeed([current, ...feed]) : sortCatalogFeed([current, ...feed]);

  const ids = new Set<string>();
  const merged: Video[] = [];

  for (const item of sorted) {
    if (ids.has(item.id)) continue;
    ids.add(item.id);
    merged.push(item);
  }

  return merged;
}

export function VideoPageContent({ video, feed, feedMode }: VideoPageContentProps) {
  const router = useRouter();
  const { t } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const loopFeed = feedMode === "clash";

  const videos = useMemo(() => buildFeed(video, feed, feedMode), [video, feed, feedMode]);
  const [activeId, setActiveId] = useState(video.id);
  const [showSwipeHint, setShowSwipeHint] = useState(false);

  const activeIndex = videos.findIndex((item) => item.id === activeId);

  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const container = containerRef.current;
    if (!container) return;

    const slideHeight = container.clientHeight;
    container.scrollTo({ top: index * slideHeight, behavior });
  }, []);

  const wrapIndex = useCallback(
    (index: number) => {
      if (videos.length === 0) return 0;
      if (!loopFeed) return index;
      return ((index % videos.length) + videos.length) % videos.length;
    },
    [loopFeed, videos.length],
  );

  const goToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      if (videos.length === 0) return;

      const nextIndex = wrapIndex(index);
      if (!loopFeed && (nextIndex < 0 || nextIndex >= videos.length)) return;

      const next = videos[nextIndex];
      setActiveId(next.id);
      scrollToIndex(nextIndex, behavior);
      const feedQuery = feedMode === "catalog" ? "?feed=catalog" : "?feed=clash";
      window.history.replaceState(null, "", `/video/${next.id}${feedQuery}`);
    },
    [feedMode, loopFeed, scrollToIndex, videos, wrapIndex],
  );

  useEffect(() => {
    if (videos.length <= 1) return;

    setShowSwipeHint(true);
    const timer = window.setTimeout(() => setShowSwipeHint(false), 1000);
    return () => window.clearTimeout(timer);
  }, [videos.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const startIndex = videos.findIndex((item) => item.id === video.id);
    if (startIndex >= 0) {
      requestAnimationFrame(() => {
        scrollToIndex(startIndex, "auto");
      });
    }
  }, [video.id, videos, scrollToIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const slideHeight = container.clientHeight || 1;
      const index = Math.round(container.scrollTop / slideHeight);
      const next = videos[index];

      if (next && next.id !== activeId) {
        setActiveId(next.id);
        const feedQuery = feedMode === "catalog" ? "?feed=catalog" : "?feed=clash";
        window.history.replaceState(null, "", `/video/${next.id}${feedQuery}`);
      }
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [activeId, feedMode, videos]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        router.push(feedMode === "catalog" ? "/videos" : "/");
        return;
      }

      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        goToIndex(activeIndex + 1);
      }

      if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        goToIndex(activeIndex - 1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, feedMode, goToIndex, router]);

  function handleClose() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(feedMode === "catalog" ? "/videos" : "/");
  }

  return (
    <div className="relative h-[calc(100dvh-3.5rem)] w-full bg-black">
      <button
        type="button"
        onClick={handleClose}
        aria-label={t.common.back}
        className="absolute start-4 top-4 z-30 flex h-10 items-center justify-center gap-1 rounded-full bg-black/60 px-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-black/80"
      >
        <BackArrowIcon />
        <span className="hidden sm:inline">{t.common.back}</span>
      </button>

      {showSwipeHint && videos.length > 1 ? (
        <div
          className="pointer-events-none absolute start-1/2 top-16 z-20 flex -translate-x-1/2 flex-col items-center gap-0.5 text-white/90 transition-opacity duration-300"
          aria-hidden
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <path d="M12 5l-7 7h14l-7-7z" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <path d="M12 19l7-7H5l7 7z" />
          </svg>
        </div>
      ) : null}

      <div
        ref={containerRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory overscroll-y-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {videos.map((item) => (
          <VideoSlide
            key={item.id}
            video={item}
            isActive={item.id === activeId}
            showRank={feedMode === "clash" || typeof item.global_rank === "number"}
          />
        ))}
      </div>
    </div>
  );
}
