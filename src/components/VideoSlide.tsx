"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChallengeClipButton } from "@/components/duel/ChallengeClipButton";
import { VideoCardActions } from "@/components/VideoCardActions";
import { VideoCardChannel } from "@/components/VideoCardChannel";
import { VideoRankBadge } from "@/components/VideoRankBadge";
import { VideoSettingsMenu } from "@/components/VideoSettingsMenu";
import { createBrowserClient } from "@/lib/supabase/client";
import { getVideoPosterUrl, getVideoPreload } from "@/lib/mediaQuality";
import { incrementVideoViews } from "@/lib/videoEngagement";
import { blockPublicVideoContextMenu, PUBLIC_VIDEO_CONTROLS_LIST } from "@/lib/videoPlayer";
import { useLocale } from "@/providers/LocaleProvider";
import type { Video } from "@/lib/types";

type VideoSlideProps = {
  video: Video;
  isActive: boolean;
  showRank?: boolean;
  onEnded?: () => void;
};

export function VideoSlide({ video, isActive, showRank = false, onEnded }: VideoSlideProps) {
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [viewsCount, setViewsCount] = useState(video.views_count ?? 0);
  const hasVideo = Boolean(video.video_url?.trim());

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
      } catch {
        element.muted = true;
        try {
          await element.play();
        } catch {
          // Browser blocked autoplay; controls remain available.
        }
      }
    };

    if (element.readyState >= 2) {
      void startPlayback();
      return;
    }

    element.addEventListener("loadeddata", startPlayback, { once: true });
    return () => element.removeEventListener("loadeddata", startPlayback);
  }, [hasVideo, isActive, video.video_url]);

  useEffect(() => {
    if (!supabase || !isActive) return;

    void incrementVideoViews(supabase, video.id).then((counted) => {
      if (counted) {
        setViewsCount((count) => count + 1);
      }
    });
  }, [supabase, video.id, isActive]);

  return (
    <section
      data-video-id={video.id}
      className="relative h-[calc(100dvh-3.5rem)] w-full shrink-0 snap-start snap-always bg-black"
    >
      {hasVideo ? (
        <>
          <video
            ref={videoRef}
            src={video.video_url}
            controls
            controlsList={PUBLIC_VIDEO_CONTROLS_LIST}
            onContextMenu={blockPublicVideoContextMenu}
            onEnded={() => {
              if (isActive) onEnded?.();
            }}
            playsInline
            preload={getVideoPreload(isActive)}
            poster={getVideoPosterUrl(video.thumbnail_url)}
            className="absolute inset-0 h-full w-full object-contain"
          >
            {t.video.unavailable}
          </video>
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
        {viewsCount.toLocaleString()} {t.video.views}
      </span>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent px-4 pb-24 pt-16 sm:px-6">
        <div className="pointer-events-auto space-y-3">
          <h1 className="text-lg font-bold leading-snug text-white sm:text-xl">{video.title}</h1>

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

          {(!video.moderation_status || video.moderation_status === "approved") ? (
            <ChallengeClipButton
              challengedVideoId={video.id}
              challengedVideoTitle={video.title}
              challengedVideoOwnerId={video.user_id}
              variant="overlay"
            />
          ) : null}

          {video.hashtags && video.hashtags.length > 0 ? (
            <p className="text-sm font-semibold text-zinc-300">
              {video.hashtags.map((tag) => `#${tag}`).join(" ")}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
