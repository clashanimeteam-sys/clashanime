"use client";

import { useState } from "react";
import { formatCount } from "@/lib/format";
import { useLocale } from "@/providers/LocaleProvider";

type VideoCardActionsProps = {
  videoId: string;
  title: string;
  initialLikes: number;
  commentsCount: number;
};

export function VideoCardActions({
  videoId,
  title,
  initialLikes,
  commentsCount,
}: VideoCardActionsProps) {
  const { t } = useLocale();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [reported, setReported] = useState(false);

  function handleLike() {
    setLiked((prev) => {
      setLikesCount((count) => (prev ? count - 1 : count + 1));
      return !prev;
    });
  }

  async function handleShare() {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/video/${videoId}`
        : `https://www.clashanime.com/video/${videoId}`;

    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }

      await navigator.clipboard.writeText(url);
      setShareStatus(t.video.linkCopied);
    } catch {
      setShareStatus(t.video.shareCancelled);
    }

    window.setTimeout(() => setShareStatus(null), 2000);
  }

  function handleReport() {
    setReported(true);
    window.setTimeout(() => setReported(false), 2500);
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleLike}
          aria-pressed={liked}
          aria-label={liked ? t.video.unlike : t.video.like}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
            liked
              ? "border-accent bg-accent/10 text-accent"
              : "border-zinc-300 text-zinc-700 hover:border-accent/40 hover:text-accent dark:border-zinc-700 dark:text-zinc-200"
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
          {formatCount(likesCount)}
        </button>

        <button
          type="button"
          aria-label={t.video.comments}
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:border-accent/40 hover:text-accent dark:border-zinc-700 dark:text-zinc-200"
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
          {formatCount(commentsCount)}
        </button>

        <button
          type="button"
          onClick={handleShare}
          aria-label={t.video.share}
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:border-accent/40 hover:text-accent dark:border-zinc-700 dark:text-zinc-200"
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
          {t.video.share}
        </button>

        <button
          type="button"
          onClick={handleReport}
          aria-label={t.video.report}
          className="inline-flex items-center gap-1 rounded-full border border-zinc-300 px-2.5 py-1.5 text-xs font-semibold text-zinc-600 transition-colors hover:border-red-400/50 hover:text-red-500 dark:border-zinc-700 dark:text-zinc-200"
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

      {(shareStatus || reported) && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400" role="status">
          {shareStatus ?? t.video.reportSubmitted}
        </p>
      )}
    </div>
  );
}
