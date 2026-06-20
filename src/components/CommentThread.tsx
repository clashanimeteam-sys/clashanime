"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { useRequireSubscription } from "@/hooks/useRequireSubscription";
import { createBrowserClient } from "@/lib/supabase/client";
import { formatRelativeTime } from "@/lib/format";
import { pinVideoComment, toggleCommentLike, unpinVideoComment } from "@/lib/videoEngagement";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";
import type { VideoComment } from "@/lib/types";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type CommentThreadProps = {
  comment: VideoComment;
  videoId: string;
  videoOwnerId: string | null;
  pinnedCommentId: string | null;
  depth?: number;
  onClose: () => void;
  onReply: (comment: VideoComment) => void;
  onRefresh: () => void;
  onPinChange: (commentId: string | null) => void;
  onCommentUpdate: (commentId: string, patch: Partial<VideoComment>) => void;
};

export function CommentThread({
  comment,
  videoId,
  videoOwnerId,
  pinnedCommentId,
  depth = 0,
  onClose,
  onReply,
  onRefresh,
  onPinChange,
  onCommentUpdate,
}: CommentThreadProps) {
  const { user } = useAuth();
  const { requireSubscription } = useRequireSubscription();
  const { locale, t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);

  const [expanded, setExpanded] = useState(depth > 0);
  const [liking, setLiking] = useState(false);
  const [pinning, setPinning] = useState(false);

  const name = comment.display_name?.trim() || comment.username;
  const isPinned = comment.id === pinnedCommentId;
  const canPin =
    Boolean(
      user &&
        videoOwnerId &&
        user.id === videoOwnerId &&
        comment.user_id === user.id &&
        !comment.parent_id,
    );
  const replyCount = comment.replies.length;

  async function handleLike() {
    if (!supabase || !requireSubscription()) return;
    if (!user) return;

    setLiking(true);

    const nextCount = await toggleCommentLike(supabase, comment.id, user.id, comment.liked_by_me);

    if (nextCount !== null) {
      onCommentUpdate(comment.id, {
        liked_by_me: !comment.liked_by_me,
        likes_count: nextCount,
      });
    }

    setLiking(false);
  }

  async function handlePin() {
    if (!supabase || !user || !videoOwnerId) return;

    setPinning(true);

    if (isPinned) {
      const ok = await unpinVideoComment(supabase, videoId, user.id);
      if (ok) onPinChange(null);
    } else {
      const pinned = await pinVideoComment(supabase, videoId, comment.id, user.id);
      if (pinned) onPinChange(pinned);
    }

    setPinning(false);
    onRefresh();
  }

  return (
    <li className={depth > 0 ? "ms-6 border-s border-zinc-200 ps-3 dark:border-zinc-800" : undefined}>
      <div className="flex gap-3">
        <Link
          href={`/channel/${comment.username}`}
          className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
          onClick={onClose}
        >
          {comment.avatar_url ? (
            <Image
              src={comment.avatar_url}
              alt={name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-zinc-500">
              {getInitials(name)}
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              {isPinned ? (
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-accent">
                  {t.video.pinned}
                </p>
              ) : null}
              <p className="text-sm leading-relaxed text-black dark:text-white">
                <span className="me-2 inline-flex max-w-full items-center gap-1 align-middle">
                  <Link
                    href={`/channel/${comment.username}`}
                    className="truncate font-bold hover:underline"
                    onClick={onClose}
                  >
                    {name}
                  </Link>
                  {comment.is_verified ? <VerifiedBadge className="shrink-0" /> : null}
                </span>
                {comment.body}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-zinc-500">
                <span>{formatRelativeTime(comment.created_at, locale)}</span>
                {comment.likes_count > 0 ? (
                  <span>
                    {comment.likes_count.toLocaleString()} {t.video.commentLikes}
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    if (!requireSubscription()) return;
                    onReply(comment);
                  }}
                  className="hover:text-black dark:hover:text-white"
                >
                  {t.video.reply}
                </button>
                {canPin ? (
                  <button
                    type="button"
                    onClick={handlePin}
                    disabled={pinning}
                    className="hover:text-accent"
                  >
                    {isPinned ? t.video.unpinComment : t.video.pinComment}
                  </button>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              onClick={handleLike}
              disabled={liking}
              aria-pressed={comment.liked_by_me}
              aria-label={comment.liked_by_me ? t.video.unlike : t.video.like}
              className={`shrink-0 pt-0.5 transition-colors ${
                comment.liked_by_me ? "text-accent" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
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
            </button>
          </div>

          {replyCount > 0 ? (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="mt-2 text-xs font-bold text-zinc-500 hover:text-black dark:hover:text-white"
            >
              {expanded
                ? t.video.hideReplies
                : t.video.viewReplies.replace("{count}", String(replyCount))}
            </button>
          ) : null}

          {expanded && replyCount > 0 ? (
            <ul className="mt-3 space-y-3">
              {comment.replies.map((reply) => (
                <CommentThread
                  key={reply.id}
                  comment={reply}
                  videoId={videoId}
                  videoOwnerId={videoOwnerId}
                  pinnedCommentId={pinnedCommentId}
                  depth={depth + 1}
                  onClose={onClose}
                  onReply={onReply}
                  onRefresh={onRefresh}
                  onPinChange={onPinChange}
                  onCommentUpdate={onCommentUpdate}
                />
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export function updateCommentInTree(
  comments: VideoComment[],
  commentId: string,
  patch: Partial<VideoComment>,
): VideoComment[] {
  return comments.map((comment) => {
    if (comment.id === commentId) {
      return { ...comment, ...patch };
    }

    if (comment.replies.length > 0) {
      return {
        ...comment,
        replies: updateCommentInTree(comment.replies, commentId, patch),
      };
    }

    return comment;
  });
}
