"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { FollowButton } from "@/components/FollowButton";
import { HashtagLinks } from "@/components/HashtagLinks";
import { VideoCardActions } from "@/components/VideoCardActions";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { VideoRankBadge } from "@/components/VideoRankBadge";
import { VideoSettingsMenu } from "@/components/VideoSettingsMenu";
import { useAuth } from "@/providers/AuthProvider";
import { createBrowserClient } from "@/lib/supabase/client";
import { getVideoPosterUrl, getVideoPreload } from "@/lib/mediaQuality";
import { incrementVideoViews } from "@/lib/videoEngagement";
import {
  blockPublicVideoContextMenu,
  PUBLIC_VIDEO_PLAYER_CLASS,
  SHORTS_PROGRESS_CLASS,
} from "@/lib/videoPlayer";
import { useLocale } from "@/providers/LocaleProvider";
import type { Video } from "@/lib/types";

type VideoSlideProps = {
  video: Video;
  isActive: boolean;
  showRank?: boolean;
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const PROGRESS_BAR_HIDE_MS = 2500;

export function VideoSlide({ video, isActive, showRank = false }: VideoSlideProps) {
  const { t, formatNumber } = useLocale();
  const { user } = useAuth();
  const supabase = useMemo(() => createBrowserClient(), []);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideProgressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPausedRef = useRef(false);
  const isSeekingRef = useRef(false);
  const [viewsCount, setViewsCount] = useState(video.views_count ?? 0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [progressBarVisible, setProgressBarVisible] = useState(false);
  const hasVideo = Boolean(video.video_url?.trim());
  const channelLabel = video.channel?.display_name?.trim() || video.channel?.username || "";
  const progressPercent =
    duration > 0 ? `${Math.min(100, Math.max(0, (currentTime / duration) * 100))}%` : "0%";

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    isSeekingRef.current = isSeeking;
  }, [isSeeking]);

  useEffect(() => {
    return () => {
      if (hideProgressTimerRef.current) {
        clearTimeout(hideProgressTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
      setProgressBarVisible(false);
      if (hideProgressTimerRef.current) {
        clearTimeout(hideProgressTimerRef.current);
        hideProgressTimerRef.current = null;
      }
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    if (isPaused || isSeeking) {
      setProgressBarVisible(true);
      if (hideProgressTimerRef.current) {
        clearTimeout(hideProgressTimerRef.current);
        hideProgressTimerRef.current = null;
      }
      return;
    }

    if (hideProgressTimerRef.current) {
      clearTimeout(hideProgressTimerRef.current);
    }

    hideProgressTimerRef.current = setTimeout(() => {
      if (!isPausedRef.current && !isSeekingRef.current) {
        setProgressBarVisible(false);
      }
    }, PROGRESS_BAR_HIDE_MS);

    return () => {
      if (hideProgressTimerRef.current) {
        clearTimeout(hideProgressTimerRef.current);
        hideProgressTimerRef.current = null;
      }
    };
  }, [isActive, isPaused, isSeeking]);

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
        setIsPaused(false);
        return;
      } catch {
        element.muted = true;
        setIsMuted(true);
        try {
          await element.play();
          setIsPaused(false);
        } catch {
          setIsPaused(true);
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

    const onPlay = () => setIsPaused(false);
    const onPause = () => setIsPaused(true);
    const onVolumeChange = () => setIsMuted(element.muted);

    syncDuration();
    element.addEventListener("loadedmetadata", syncDuration);
    element.addEventListener("durationchange", syncDuration);
    element.addEventListener("timeupdate", onTimeUpdate);
    element.addEventListener("play", onPlay);
    element.addEventListener("pause", onPause);
    element.addEventListener("volumechange", onVolumeChange);

    return () => {
      element.removeEventListener("loadedmetadata", syncDuration);
      element.removeEventListener("durationchange", syncDuration);
      element.removeEventListener("timeupdate", onTimeUpdate);
      element.removeEventListener("play", onPlay);
      element.removeEventListener("pause", onPause);
      element.removeEventListener("volumechange", onVolumeChange);
    };
  }, [hasVideo, isSeeking, video.video_url]);

  useEffect(() => {
    if (!supabase || !user || !video.user_id) {
      setIsFollowing(false);
      return;
    }

    void supabase
      .from("channel_follows")
      .select("following_id")
      .eq("follower_id", user.id)
      .eq("following_id", video.user_id)
      .maybeSingle()
      .then(({ data }) => setIsFollowing(Boolean(data)));
  }, [supabase, user, video.user_id]);

  function clearHideProgressTimer() {
    if (hideProgressTimerRef.current) {
      clearTimeout(hideProgressTimerRef.current);
      hideProgressTimerRef.current = null;
    }
  }

  function revealProgressBar() {
    setProgressBarVisible(true);
  }

  function scheduleHideProgressBar() {
    clearHideProgressTimer();

    if (isPausedRef.current || isSeekingRef.current) return;

    hideProgressTimerRef.current = setTimeout(() => {
      if (!isPausedRef.current && !isSeekingRef.current) {
        setProgressBarVisible(false);
      }
    }, PROGRESS_BAR_HIDE_MS);
  }

  function handleSeek(nextTime: number) {
    const element = videoRef.current;
    if (!element) return;

    const clamped = Math.min(Math.max(nextTime, 0), duration || element.duration || 0);
    element.currentTime = clamped;
    setCurrentTime(clamped);
  }

  function handleVideoClick() {
    revealProgressBar();
    scheduleHideProgressBar();
    togglePlayback();
  }

  function handleProgressReveal(event: { stopPropagation: () => void }) {
    event.stopPropagation();
    revealProgressBar();
    scheduleHideProgressBar();
  }

  function togglePlayback() {
    const element = videoRef.current;
    if (!element) return;

    if (element.paused) {
      void element.play();
    } else {
      element.pause();
    }
  }

  function toggleMute() {
    const element = videoRef.current;
    if (!element) return;

    element.muted = !element.muted;
    setIsMuted(element.muted);
  }

  return (
    <section
      data-video-id={video.id}
      className="relative flex h-full w-full shrink-0 snap-start snap-always items-stretch justify-center bg-black md:h-[calc(100dvh-3.5rem)] md:items-center md:px-6"
    >
      <div className="flex h-full w-full max-w-full items-end justify-center gap-3 md:gap-5">
        <article className="relative h-full w-full overflow-hidden bg-black md:h-[min(calc(100dvh-7rem),42rem)] md:w-[min(100%,calc((100dvh-7rem)*9/16))] md:max-w-[calc(100vw-7rem)] md:rounded-2xl md:shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
          {hasVideo ? (
            <>
              <video
                ref={videoRef}
                src={video.video_url}
                onContextMenu={blockPublicVideoContextMenu}
                onClick={handleVideoClick}
                autoPlay={isActive}
                loop
                playsInline
                disablePictureInPicture
                controlsList="nodownload noplaybackrate noremoteplayback"
                preload={getVideoPreload(isActive)}
                poster={getVideoPosterUrl(video.thumbnail_url)}
                className={`${PUBLIC_VIDEO_PLAYER_CLASS} h-full w-full cursor-pointer object-cover`}
              >
                {t.video.unavailable}
              </video>

              {isPaused && isActive ? (
                <div className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-black/20 md:flex">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-8 w-8"
                      aria-hidden
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>
              ) : null}

              {isActive ? (
                <>
                  <div className="absolute right-3 top-3 z-30 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleMute();
                      }}
                      aria-label={isMuted ? t.video.unmute : t.video.mute}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                    >
                      {isMuted ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-4 w-4"
                          aria-hidden
                        >
                          <path d="M11 5L6 9H3v6h3l5 4V5z" />
                          <line x1="23" y1="9" x2="17" y2="15" />
                          <line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-4 w-4"
                          aria-hidden
                        >
                          <path d="M11 5L6 9H3v6h3l5 4V5z" />
                          <path d="M19 9a5 5 0 0 1 0 6" />
                          <path d="M17 7a7 7 0 0 1 0 10" />
                        </svg>
                      )}
                    </button>
                    <VideoSettingsMenu
                      videoRef={videoRef}
                      videoId={video.id}
                      title={video.title}
                      embedded
                    />
                  </div>

                  <div
                    className={`absolute inset-x-0 bottom-0 z-30 transition-opacity duration-300 max-md:px-0 md:px-3 md:pb-2 md:pt-10 ${
                      progressBarVisible
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0"
                    }`}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <input
                      type="range"
                      min={0}
                      max={duration || 0}
                      step={0.05}
                      value={Math.min(currentTime, duration || 0)}
                      onPointerDown={(event) => {
                        event.stopPropagation();
                        setIsSeeking(true);
                        revealProgressBar();
                        clearHideProgressTimer();
                      }}
                      onChange={(event) => {
                        setIsSeeking(true);
                        handleSeek(Number(event.target.value));
                      }}
                      onPointerUp={() => {
                        setIsSeeking(false);
                        scheduleHideProgressBar();
                      }}
                      onPointerCancel={() => {
                        setIsSeeking(false);
                        scheduleHideProgressBar();
                      }}
                      onBlur={() => {
                        setIsSeeking(false);
                        scheduleHideProgressBar();
                      }}
                      style={{ "--progress": progressPercent } as CSSProperties}
                      className={`${SHORTS_PROGRESS_CLASS} w-full max-md:h-[3px] max-md:rounded-none ${
                        progressBarVisible ? "shorts-progress--visible" : ""
                      }`}
                      aria-label={t.video.views}
                    />
                  </div>

                  {!progressBarVisible ? (
                    <button
                      type="button"
                      className="absolute inset-x-0 bottom-0 z-[24] h-12 bg-transparent"
                      aria-label={t.video.views}
                      onClick={handleProgressReveal}
                    />
                  ) : null}
                </>
              ) : null}

              {isActive ? (
                <div className="absolute bottom-36 right-2 z-20 md:hidden">
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
              ) : null}
            </>
          ) : (
            <>
              <Image
                src={getVideoPosterUrl(video.thumbnail_url)}
                alt={video.title}
                fill
                className="object-cover opacity-70"
                unoptimized
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 px-6 text-center">
                <p className="text-sm font-semibold text-white">{t.video.unavailable}</p>
              </div>
            </>
          )}

          {showRank && typeof video.global_rank === "number" ? (
            <VideoRankBadge rank={video.global_rank} overlay embedded />
          ) : null}

          <span className="pointer-events-none absolute left-3 top-3 hidden items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm md:top-14 md:inline-flex">
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
            {formatNumber(viewsCount)}
          </span>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-3 pb-10 pt-20 max-md:pe-16 md:bottom-3 md:pb-8 md:pt-16">
            <div className="pointer-events-auto space-y-2 md:space-y-2.5">
              {video.channel ? (
                <div className="flex items-center gap-2.5">
                  <Link
                    href={`/channel/${video.channel.username}`}
                    className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-zinc-800 ring-2 ring-white/25"
                  >
                    {video.channel.avatar_url ? (
                      <Image
                        src={video.channel.avatar_url}
                        alt={channelLabel}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-[10px] font-bold text-white">
                        {getInitials(channelLabel)}
                      </span>
                    )}
                  </Link>

                  <div className="flex min-w-0 items-center gap-2">
                    <Link
                      href={`/channel/${video.channel.username}`}
                      className="font-channel inline-flex min-w-0 items-center gap-1 text-sm font-bold text-white transition-colors hover:text-orange-300"
                    >
                      <span className="truncate">@{video.channel.username}</span>
                      {video.channel.is_verified ? <VerifiedBadge className="shrink-0" /> : null}
                    </Link>

                    {video.user_id ? (
                      <FollowButton
                        channelId={video.user_id}
                        initialFollowing={isFollowing}
                        initialFollowerCount={video.channel.follower_count ?? 0}
                        compact
                      />
                    ) : null}
                  </div>
                </div>
              ) : null}

              <h1 className="line-clamp-2 text-sm font-semibold leading-snug text-white md:text-base">
                {video.title}
              </h1>

              {video.hashtags && video.hashtags.length > 0 ? (
                <HashtagLinks
                  tags={video.hashtags}
                  className="line-clamp-1 text-xs font-semibold text-white/90 md:line-clamp-2 md:text-sm"
                  linkClassName="text-white transition-colors hover:text-orange-300 hover:underline"
                />
              ) : null}
            </div>
          </div>
        </article>

        {isActive ? (
          <div className="hidden shrink-0 md:block">
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
        ) : null}
      </div>
    </section>
  );
}
