"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { VideoCommentsModal } from "@/components/VideoCommentsModal";
import { createBrowserClient } from "@/lib/supabase/client";
import {
  checkVideoLiked,
  fetchVideoCounts,
  incrementVideoShares,
  toggleVideoLike,
} from "@/lib/videoEngagement";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";
import type { VideoChannel } from "@/lib/types";

type VideoPreview = {
  thumbnailUrl: string;
  videoUrl?: string;
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
};

function formatRealCount(value: number) {
  return value.toLocaleString();
}

export function VideoCardActions({
  videoId,
  title,
  initialLikes,
  initialComments,
  initialShares = 0,
  preview,
  variant = "default",
}: VideoCardActionsProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [commentsCount, setCommentsCount] = useState(initialComments);
  const [sharesCount, setSharesCount] = useState(initialShares);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [reported, setReported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOverlay = variant === "overlay";
  const buttonClass = isOverlay
    ? "border-white/30 text-white hover:border-white/60 hover:text-white"
    : "border-zinc-300 text-zinc-700 hover:border-accent/40 hover:text-accent dark:border-zinc-700 dark:text-zinc-200";
  const likedClass = isOverlay
    ? "border-accent bg-accent/20 text-accent"
    : "border-accent bg-accent/10 text-accent";

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

  function requireAuth() {
    router.push("/login");
  }

  async function handleLike() {
    if (!supabase) return;

    if (!user) {
      requireAuth();
      return;
    }

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
    if (!supabase) return;

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
    setReported(true);
    window.setTimeout(() => setReported(false), 2500);
  }

  return (
    <>
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleLike}
            disabled={loadingLike}
            aria-pressed={liked}
            aria-label={liked ? t.video.unlike : t.video.like}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60 ${
              liked ? likedClass : buttonClass
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-3.5 w-3.5"
              aria-hidden
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {formatRealCount(likesCount)}
          </button>

          <button
            type="button"
            onClick={() => setCommentsOpen(true)}
            aria-label={t.video.comments}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${buttonClass}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-3.5 w-3.5"
              aria-hidden
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {formatRealCount(commentsCount)}
          </button>

          <button
            type="button"
            onClick={handleShare}
            aria-label={t.video.share}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${buttonClass}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-3.5 w-3.5"
              aria-hidden
            >
              <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
              <path d="M16 6l-4-4-4 4" />
              <path d="M12 2v14" />
            </svg>
            {formatRealCount(sharesCount)}
          </button>

          <button
            type="button"
            onClick={handleReport}
            aria-label={t.video.report}
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
              isOverlay
                ? "border-white/30 text-white/80 hover:border-red-400/50 hover:text-red-300"
                : "border-zinc-300 text-zinc-600 hover:border-red-400/50 hover:text-red-500 dark:border-zinc-700 dark:text-zinc-200"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-3.5 w-3.5"
              aria-hidden
            >
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <path d="M4 22v-7" />
            </svg>
          </button>
        </div>

        {(shareStatus || reported || error) && (
          <p
            className={`text-xs ${isOverlay ? "text-zinc-300" : "text-zinc-500 dark:text-zinc-400"}`}
            role="status"
          >
            {error ?? shareStatus ?? t.video.reportSubmitted}
          </p>
        )}
      </div>

      {preview ? (
        <VideoCommentsModal
          open={commentsOpen}
          onClose={() => setCommentsOpen(false)}
          videoId={videoId}
          title={title}
          thumbnailUrl={preview.thumbnailUrl}
          videoUrl={preview.videoUrl}
          channel={preview.channel}
          hashtags={preview.hashtags}
          likesCount={likesCount}
          commentsCount={commentsCount}
          sharesCount={sharesCount}
          liked={liked}
          loadingLike={loadingLike}
          onLike={handleLike}
          onShare={handleShare}
          onCommentsCountChange={setCommentsCount}
        />
      ) : null}
    </>
  );
}
