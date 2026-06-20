"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  fetchCommunityReaction,
  incrementCommunityPostShares,
  setCommunityReaction,
  type CommunityReaction,
} from "@/lib/communityEngagement";
import { createBrowserClient } from "@/lib/supabase/client";
import { useRequireSubscription } from "@/hooks/useRequireSubscription";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

type CommunityPostActionsProps = {
  postId: string;
  postPreview: string;
  initialLikes: number;
  initialDislikes: number;
  initialComments: number;
  initialShares: number;
  commentsMode?: "navigate" | "page";
  onReportOpen: () => void;
  onCountsChange?: (counts: {
    likes_count: number;
    dislikes_count: number;
    comments_count: number;
    shares_count: number;
  }) => void;
};

function formatCount(value: number) {
  return value.toLocaleString();
}

export function CommunityPostActions({
  postId,
  postPreview,
  initialLikes,
  initialDislikes,
  initialComments,
  initialShares,
  commentsMode = "navigate",
  onReportOpen,
  onCountsChange,
}: CommunityPostActionsProps) {
  const { user } = useAuth();
  const { requireSubscription } = useRequireSubscription();
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);

  const [reaction, setReaction] = useState<CommunityReaction | null>(null);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [dislikesCount, setDislikesCount] = useState(initialDislikes);
  const [commentsCount, setCommentsCount] = useState(initialComments);
  const [sharesCount, setSharesCount] = useState(initialShares);
  const [loadingReaction, setLoadingReaction] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const commentsHref = `/community/post/${postId}`;
  const buttonClass =
    "inline-flex items-center gap-1.5 rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:border-accent/40 hover:text-accent dark:border-zinc-700 dark:text-zinc-200";

  useEffect(() => {
    setLikesCount(initialLikes);
    setDislikesCount(initialDislikes);
    setCommentsCount(initialComments);
    setSharesCount(initialShares);
  }, [initialComments, initialDislikes, initialLikes, initialShares]);

  useEffect(() => {
    if (!supabase || !user) {
      setReaction(null);
      return;
    }

    fetchCommunityReaction(supabase, postId, user.id).then(setReaction);
  }, [supabase, user, postId]);

  function syncCounts(counts: {
    likes_count: number;
    dislikes_count: number;
    comments_count: number;
    shares_count: number;
  }) {
    setLikesCount(counts.likes_count);
    setDislikesCount(counts.dislikes_count);
    setCommentsCount(counts.comments_count);
    setSharesCount(counts.shares_count);
    onCountsChange?.(counts);
  }

  async function handleReaction(next: CommunityReaction) {
    if (!supabase || !requireSubscription() || !user) return;

    setLoadingReaction(true);
    setError(null);

    const target = reaction === next ? null : next;
    const counts = await setCommunityReaction(supabase, postId, user.id, target, reaction);

    if (counts) {
      setReaction(target);
      syncCounts({ ...counts, comments_count: commentsCount, shares_count: sharesCount });
    } else {
      setError(t.communityFeed.actionFailed);
    }

    setLoadingReaction(false);
  }

  async function handleShare() {
    if (!supabase || !requireSubscription()) return;

    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${commentsHref}`
        : `https://www.clashanime.com${commentsHref}`;

    let shared = false;

    try {
      if (navigator.share) {
        await navigator.share({ title: postPreview.slice(0, 80), url });
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
      const nextShares = await incrementCommunityPostShares(supabase, postId);
      if (nextShares !== null) {
        setSharesCount(nextShares);
        onCountsChange?.({
          likes_count: likesCount,
          dislikes_count: dislikesCount,
          comments_count: commentsCount,
          shares_count: nextShares,
        });
      }
    }

    window.setTimeout(() => setShareStatus(null), 2000);
  }

  function handleCommentsClick(event: React.MouseEvent) {
    if (commentsMode === "page") {
      event.preventDefault();
      document.getElementById("comments")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (!requireSubscription(commentsHref)) {
      event.preventDefault();
    }
  }

  function handleReport() {
    if (!requireSubscription()) return;
    onReportOpen();
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => handleReaction("like")}
          disabled={loadingReaction}
          aria-pressed={reaction === "like"}
          className={`${buttonClass} ${reaction === "like" ? "border-accent bg-accent/10 text-accent" : ""}`}
        >
          👍 {formatCount(likesCount)}
        </button>

        <button
          type="button"
          onClick={() => handleReaction("dislike")}
          disabled={loadingReaction}
          aria-pressed={reaction === "dislike"}
          className={`${buttonClass} ${reaction === "dislike" ? "border-red-400 bg-red-500/10 text-red-500" : ""}`}
        >
          👎 {formatCount(dislikesCount)}
        </button>

        {commentsMode === "page" ? (
          <a href="#comments" onClick={handleCommentsClick} className={buttonClass}>
            💬 {formatCount(commentsCount)}
          </a>
        ) : (
          <Link href={commentsHref} onClick={handleCommentsClick} className={buttonClass}>
            💬 {formatCount(commentsCount)}
          </Link>
        )}

        <button type="button" onClick={handleShare} className={buttonClass}>
          ↗ {formatCount(sharesCount)}
        </button>

        <button
          type="button"
          onClick={handleReport}
          className="inline-flex items-center gap-1 rounded-full border border-zinc-300 px-2.5 py-1.5 text-xs font-semibold text-zinc-600 transition-colors hover:border-red-400/50 hover:text-red-500 dark:border-zinc-700 dark:text-zinc-200"
        >
          {t.communityFeed.report}
        </button>
      </div>

      {(shareStatus || error) && (
        <p className="text-xs text-zinc-500" role="status">
          {error ?? shareStatus}
        </p>
      )}
    </div>
  );
}
