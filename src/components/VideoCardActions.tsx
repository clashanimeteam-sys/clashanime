"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import {
  checkVideoLiked,
  fetchVideoCounts,
  incrementVideoShares,
  toggleVideoLike,
} from "@/lib/videoEngagement";
import { useRequireSubscription } from "@/hooks/useRequireSubscription";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";
import { useVideoOverlay } from "@/providers/VideoOverlayProvider";
import type { VideoChannel } from "@/lib/types";

type VideoPreview = {
  thumbnailUrl: string;
  videoUrl?: string;
  videoOwnerId?: string | null;
  channel?: VideoChannel | null;
  hashtags?: string[];
};

type VideoCardActionsProps = {
  videoId: string;
  title: string;
  initialLikes: number;
  initialComments: number;
  initialShares?: number;
  preview?: VideoPreview;
  variant?: "default" | "overlay";
  compact?: boolean;
};

export function VideoCardActions({
  videoId,
  title,
  initialLikes,
  initialComments,
  initialShares = 0,
  preview,
  variant = "default",
  compact = false,
}: VideoCardActionsProps) {
  const { user } = useAuth();
  const { requireSubscription } = useRequireSubscription();
  const { t, formatNumber, formatDateTime } = useLocale();
  const { openComments, openReport, syncCommentsSession, commentsVideoId } = useVideoOverlay();
  const supabase = useMemo(() => createBrowserClient(), []);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [commentsCount, setCommentsCount] = useState(initialComments);
  const [sharesCount, setSharesCount] = useState(initialShares);
  const [loadingLike, setLoadingLike] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isOverlay = variant === "overlay";
  const actionButtonClass = compact
    ? "inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold transition-colors disabled:opacity-60"
    : isOverlay
      ? "inline-flex flex-col items-center gap-1 border-0 bg-transparent p-0 text-[11px] font-semibold leading-none text-white shadow-none transition-opacity hover:opacity-80 disabled:opacity-60 max-md:drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]"
      : "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60";
  const iconWrapClass = isOverlay
    ? "flex h-10 w-10 items-center justify-center text-white max-md:h-auto max-md:w-auto max-md:bg-transparent md:rounded-full md:bg-zinc-900/75 md:backdrop-blur-sm"
    : "";
  const iconClass = compact ? "h-2.5 w-2.5" : isOverlay ? "h-7 w-7 md:h-5 md:w-5" : "h-3.5 w-3.5";
  const buttonClass = isOverlay
    ? ""
    : "border-zinc-300 text-zinc-700 hover:border-accent/40 hover:text-accent dark:border-zinc-700 dark:text-zinc-200";
  const likedClass = isOverlay
    ? "text-white"
    : "border-accent bg-accent/10 text-accent";
  const likedIconWrapClass = isOverlay ? "text-accent md:rounded-full md:bg-accent md:text-white" : "";

  useEffect(() => {
    setLikesCount(initialLikes);
    setCommentsCount(initialComments);
    setSharesCount(initialShares);
  }, [initialComments, initialLikes, initialShares]);

  useEffect(() => {
    if (!supabase || !user) {
      setLiked(false);
      return;
    }

    checkVideoLiked(supabase, videoId, user.id).then(setLiked);
  }, [supabase, user, videoId]);

  useEffect(() => {
    if (commentsVideoId !== videoId) return;

    syncCommentsSession(videoId, {
      likesCount,
      commentsCount,
      sharesCount,
      liked,
      loadingLike,
    });
  }, [
    commentsVideoId,
    videoId,
    likesCount,
    commentsCount,
    sharesCount,
    liked,
    loadingLike,
    syncCommentsSession,
  ]);

  async function handleLike() {
    if (!supabase || !requireSubscription() || !user) return;

    setLoadingLike(true);
    setError(null);

    const counts = await toggleVideoLike(supabase, videoId, user.id, liked);

    if (counts) {
      setLiked(!liked);
      setLikesCount(counts.likes_count);
    } else {
      setError(t.video.actionFailed);
    }

    setLoadingLike(false);
  }

  async function handleShare() {
    if (!supabase || !requireSubscription()) return;

    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/video/${videoId}`
        : `https://www.clashanime.com/video/${videoId}`;

    let shared = false;

    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        shared = true;
      } else {
        await navigator.clipboard.writeText(url);
        setShareStatus(t.video.linkCopied);
        shared = true;
      }
    } catch {
      setShareStatus(t.video.shareCancelled);
    }

    if (shared) {
      const nextShares = await incrementVideoShares(supabase, videoId);
      if (nextShares !== null) {
        setSharesCount(nextShares);
      } else {
        const counts = await fetchVideoCounts(supabase, videoId);
        if (counts) setSharesCount(counts.shares_count);
      }
    }

    window.setTimeout(() => setShareStatus(null), 2000);
  }

  function handleReport() {
    if (!requireSubscription(`/report?video=${videoId}`)) return;

    setError(null);
    openReport({ videoId, title });
  }

  function handleCommentsOpen() {
    if (!preview || !requireSubscription()) return;

    openComments({
      videoId,
      title,
      preview,
      likesCount,
      commentsCount,
      sharesCount,
      liked,
      loadingLike,
      onLike: handleLike,
      onShare: handleShare,
      onCommentsCountChange: setCommentsCount,
    });
  }

  return (
    <div className="space-y-2">
      <div
        className={
          isOverlay
            ? "flex flex-col items-center gap-5 pb-2 max-md:gap-4"
            : `flex flex-wrap items-center ${compact ? "gap-1" : "gap-2"}`
        }
      >
        <button
          type="button"
          onClick={handleLike}
          disabled={loadingLike}
          aria-pressed={liked}
          aria-label={liked ? t.video.unlike : t.video.like}
          className={`${actionButtonClass} ${liked ? likedClass : buttonClass}`}
        >
          <span className={`${iconWrapClass} ${liked ? likedIconWrapClass : ""}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={iconClass}
              aria-hidden
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </span>
          {isOverlay ? <span>{formatNumber(likesCount)}</span> : formatNumber(likesCount)}
        </button>

        <button
          type="button"
          onClick={handleCommentsOpen}
          aria-label={t.video.comments}
          className={`${actionButtonClass} ${buttonClass}`}
        >
          <span className={iconWrapClass}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={iconClass}
              aria-hidden
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          {isOverlay ? <span>{formatNumber(commentsCount)}</span> : formatNumber(commentsCount)}
        </button>

        <button
          type="button"
          onClick={handleShare}
          aria-label={t.video.share}
          className={`${actionButtonClass} ${buttonClass}`}
        >
          <span className={iconWrapClass}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={iconClass}
              aria-hidden
            >
              <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
              <path d="M16 6l-4-4-4 4" />
              <path d="M12 2v14" />
            </svg>
          </span>
          {isOverlay ? <span>{formatNumber(sharesCount)}</span> : formatNumber(sharesCount)}
        </button>

        {!isOverlay ? (
        <button
          type="button"
          onClick={handleReport}
          aria-label={t.video.report}
          className={`${actionButtonClass} border-zinc-300 text-zinc-600 hover:border-red-400/50 hover:text-red-500 dark:border-zinc-700 dark:text-zinc-200`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={iconClass}
            aria-hidden
          >
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <path d="M4 22v-7" />
          </svg>
        </button>
        ) : null}
      </div>

      {isOverlay && preview?.channel ? (
        <Link
          href={`/channel/${preview.channel.username}`}
          className="mx-auto mt-1 block max-md:mt-0"
          aria-label={preview.channel.display_name ?? preview.channel.username}
        >
          <span className="relative block h-10 w-10 overflow-hidden rounded-full ring-2 ring-white max-md:h-9 max-md:w-9">
            {preview.channel.avatar_url ? (
              <Image
                src={preview.channel.avatar_url}
                alt={preview.channel.display_name ?? preview.channel.username}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-zinc-800 text-[10px] font-bold text-white">
                {(preview.channel.display_name ?? preview.channel.username).slice(0, 1).toUpperCase()}
              </span>
            )}
          </span>
        </Link>
      ) : null}

      {(shareStatus || error) && (
        <p
          className={`text-xs ${isOverlay ? "text-zinc-300" : "text-zinc-500 dark:text-zinc-400"}`}
          role="status"
        >
          {error ?? shareStatus}
        </p>
      )}
    </div>
  );
}
