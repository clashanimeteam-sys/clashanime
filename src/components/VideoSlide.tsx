"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { HashtagLinks } from "@/components/HashtagLinks";
import { VideoCardActions } from "@/components/VideoCardActions";
import { VideoCardChannel } from "@/components/VideoCardChannel";
import { VideoRankBadge } from "@/components/VideoRankBadge";
import { VideoSettingsMenu } from "@/components/VideoSettingsMenu";
import { createBrowserClient } from "@/lib/supabase/client";
import { getVideoPosterUrl, getVideoPreload } from "@/lib/mediaQuality";
import { incrementVideoViews } from "@/lib/videoEngagement";
import {
  blockPublicVideoContextMenu,
  formatVideoTimestamp,
  PUBLIC_VIDEO_CONTROLS_LIST,
  PUBLIC_VIDEO_PLAYER_CLASS,
  VIDEO_SCRUBBER_CLASS,
} from "@/lib/videoPlayer";
import { useLocale } from "@/providers/LocaleProvider";
import type { Video } from "@/lib/types";

type VideoSlideProps = {
  video: Video;
  isActive: boolean;
  showRank?: boolean;
};

export function VideoSlide({ video, isActive, showRank = false }: VideoSlideProps) {
  const { t, formatNumber } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [viewsCount, setViewsCount] = useState(video.views_count ?? 0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const hasVideo = Boolean(video.video_url?.trim());
  const progressPercent =
    duration > 0 ? `${Math.min(100, Math.max(0, (currentTime / duration) * 100))}%` : "0%";

  useEffect(() => {
    const element = videoRef.current;
    if (!element || !hasVideo) return;

    if (!isActive) {
      element.pause();
      return;
    }

    const startPlayback = async () => {
      try {
        await element.play();
        return;
      } catch {
        element.muted = true;
        try {
          await element.play();
        } catch {
          // Browser blocked autoplay; native controls remain available.
        }
      }
    };

    void startPlayback();

    element.addEventListener("canplay", startPlayback);
    return () => element.removeEventListener("canplay", startPlayback);
  }, [hasVideo, isActive, video.video_url]);

  useEffect(() => {
    if (!supabase || !isActive) return;

    void incrementVideoViews(supabase, video.id).then((counted) => {
      if (counted) {
        setViewsCount((count) => count + 1);
      }
    });
  }, [supabase, video.id, isActive]);

  useEffect(() => {
    const element = videoRef.current;
    if (!element || !hasVideo) return;

    const syncDuration = () => {
      if (Number.isFinite(element.duration)) {
        setDuration(element.duration);
      }
    };

    const onTimeUpdate = () => {
      if (!isSeeking) {
        setCurrentTime(element.currentTime);
      }
    };

    syncDuration();
    element.addEventListener("loadedmetadata", syncDuration);
    element.addEventListener("durationchange", syncDuration);
    element.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      element.removeEventListener("loadedmetadata", syncDuration);
      element.removeEventListener("durationchange", syncDuration);
      element.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [hasVideo, isSeeking, video.video_url]);

  function handleSeek(nextTime: number) {
    const element = videoRef.current;
    if (!element) return;

    const clamped = Math.min(Math.max(nextTime, 0), duration || element.duration || 0);
    element.currentTime = clamped;
    setCurrentTime(clamped);
  }

  return (
    <section
      data-video-id={video.id}
      className="relative h-[calc(100dvh-3.5rem)] w-full shrink-0 snap-start snap-always bg-black"
    >
      {hasVideo ? (
        <>
          <div className="absolute inset-0 bg-black pb-28">
            <video
              ref={videoRef}
              src={video.video_url}
              controls
              controlsList={PUBLIC_VIDEO_CONTROLS_LIST}
              onContextMenu={blockPublicVideoContextMenu}
              autoPlay={isActive}
              loop
              playsInline
              preload={getVideoPreload(isActive)}
              poster={getVideoPosterUrl(video.thumbnail_url)}
              className={`${PUBLIC_VIDEO_PLAYER_CLASS} h-full w-full object-contain`}
            >
              {t.video.unavailable}
            </video>
          </div>
          {isActive ? (
            <div className="absolute inset-x-0 bottom-[4.25rem] z-20 px-4 sm:px-5">
              <div className="rounded-xl border border-white/25 bg-zinc-950/95 px-3 py-3 shadow-[0_12px_36px_rgba(0,0,0,0.65)] backdrop-blur-md">
                <div className="mb-2 flex items-center justify-between text-xs font-bold tabular-nums text-white">
                  <span>{formatVideoTimestamp(currentTime)}</span>
                  <span className="text-white/75">{formatVideoTimestamp(duration)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.05}
                  value={Math.min(currentTime, duration || 0)}
                  onChange={(event) => {
                    setIsSeeking(true);
                    handleSeek(Number(event.target.value));
                  }}
                  onPointerUp={() => setIsSeeking(false)}
                  onPointerCancel={() => setIsSeeking(false)}
                  onBlur={() => setIsSeeking(false)}
                  style={{ "--progress": progressPercent } as CSSProperties}
                  className={`${VIDEO_SCRUBBER_CLASS} w-full`}
                  aria-label={t.video.progressBar}
                />
              </div>
            </div>
          ) : null}
          {isActive ? (
            <VideoSettingsMenu
              videoRef={videoRef}
              videoId={video.id}
              title={video.title}
            />
          ) : null}
        </>
      ) : (
        <>
          <Image
            src={getVideoPosterUrl(video.thumbnail_url)}
            alt={video.title}
            fill
            className="object-contain opacity-70"
            unoptimized
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 px-6 text-center">
            <p className="text-sm font-semibold text-white">{t.video.unavailable}</p>
          </div>
        </>
      )}

      {showRank && typeof video.global_rank === "number" ? (
        <VideoRankBadge rank={video.global_rank} overlay />
      ) : null}

      <span className="pointer-events-none absolute end-4 top-16 inline-flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-3.5 w-3.5"
          aria-hidden
        >
          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        {formatNumber(viewsCount)} {t.video.views}
      </span>

      <div className="pointer-events-none absolute inset-x-0 bottom-36 bg-gradient-to-t from-black/95 via-black/70 to-transparent px-4 pb-4 pt-16 sm:px-6">
        <div className="pointer-events-auto space-y-3">
          <h1 className="text-lg font-bold leading-snug text-white sm:text-xl">{video.title}</h1>

          {video.hashtags && video.hashtags.length > 0 ? (
            <HashtagLinks
              tags={video.hashtags}
              className="text-sm font-semibold text-white"
              linkClassName="text-white transition-colors hover:text-orange-300 hover:underline"
            />
          ) : null}

          {video.channel ? (
            <div className="[&_a]:hover:bg-white/10 [&_span]:text-zinc-200">
              <VideoCardChannel channel={video.channel} />
            </div>
          ) : null}

          <VideoCardActions
            videoId={video.id}
            title={video.title}
            initialLikes={video.likes_count}
            initialComments={video.comments_count}
            initialShares={video.shares_count ?? 0}
            preview={{
              thumbnailUrl: video.thumbnail_url,
              videoUrl: video.video_url || undefined,
              videoOwnerId: video.user_id,
              channel: video.channel,
              hashtags: video.hashtags,
            }}
            variant="overlay"
          />
        </div>
      </div>
    </section>
  );
}
