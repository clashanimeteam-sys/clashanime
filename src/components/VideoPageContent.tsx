"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { VideoSlide } from "@/components/VideoSlide";
import { useLocale } from "@/providers/LocaleProvider";
import type { Video } from "@/lib/types";

type VideoPageContentProps = {
  video: Video;
  feed: Video[];
};

function mergeFeed(current: Video, feed: Video[]): Video[] {
  const ids = new Set<string>();
  const merged: Video[] = [];

  for (const item of [current, ...feed]) {
    if (ids.has(item.id)) continue;
    ids.add(item.id);
    merged.push(item);
  }

  return merged;
}

export function VideoPageContent({ video, feed }: VideoPageContentProps) {
  const router = useRouter();
  const { t } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);

  const videos = useMemo(() => mergeFeed(video, feed), [video, feed]);
  const [activeId, setActiveId] = useState(video.id);

  const activeIndex = videos.findIndex((item) => item.id === activeId);

  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const container = containerRef.current;
    if (!container) return;

    const slideHeight = container.clientHeight;
    container.scrollTo({ top: index * slideHeight, behavior });
  }, []);

  const goToIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= videos.length) return;

      const next = videos[index];
      setActiveId(next.id);
      scrollToIndex(index);
      window.history.replaceState(null, "", `/video/${next.id}`);
    },
    [scrollToIndex, videos],
  );

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
        window.history.replaceState(null, "", `/video/${next.id}`);
      }
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [activeId, videos]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        router.push("/");
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
  }, [activeIndex, goToIndex, router]);

  function handleClose() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  }

  return (
    <div className="relative h-[calc(100dvh-3.5rem)] w-full bg-black">
      <button
        type="button"
        onClick={handleClose}
        aria-label={t.auth.close}
        className="absolute start-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5"
          aria-hidden
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {videos.length > 1 ? (
        <p className="pointer-events-none absolute start-1/2 top-4 z-20 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-[10px] font-semibold text-white/80 backdrop-blur-sm">
          {t.video.swipeVideos}
        </p>
      ) : null}

      <div
        ref={containerRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory overscroll-y-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {videos.map((item) => (
          <VideoSlide key={item.id} video={item} isActive={item.id === activeId} />
        ))}
      </div>
    </div>
  );
}
