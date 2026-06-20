"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ModalPortal } from "@/components/ModalPortal";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import {
  deleteCommunityComment,
  fetchCommunityComments,
  postCommunityComment,
  type CommunityComment,
} from "@/lib/communityEngagement";
import { createBrowserClient } from "@/lib/supabase/client";
import { useScrollLock } from "@/lib/useScrollLock";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

type CommunityPostCommentsModalProps = {
  open: boolean;
  onClose: () => void;
  postId: string;
  onCommentsCountChange?: (count: number) => void;
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function CommunityPostCommentsModal({
  open,
  onClose,
  postId,
  onCommentsCountChange,
}: CommunityPostCommentsModalProps) {
  const { user } = useAuth();
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);

  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useScrollLock(open);

  useEffect(() => {
    if (!open || !supabase) return;

    setLoading(true);
    fetchCommunityComments(supabase, postId).then((rows) => {
      setComments(rows);
      onCommentsCountChange?.(rows.length);
      setLoading(false);
    });
  }, [open, postId, supabase, onCommentsCountChange]);

  useEffect(() => {
    if (!open) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !user || !body.trim()) return;

    setPosting(true);
    setError(null);

    const counts = await postCommunityComment(supabase, postId, user.id, body);
    if (!counts) {
      setError(t.communityFeed.actionFailed);
      setPosting(false);
      return;
    }

    setBody("");
    const rows = await fetchCommunityComments(supabase, postId);
    setComments(rows);
    onCommentsCountChange?.(counts.comments_count);
    setPosting(false);
  }

  async function handleDeleteComment(commentId: string) {
    if (!supabase || !user) return;
    if (!window.confirm(t.communityFeed.confirmDeleteComment)) return;

    const ok = await deleteCommunityComment(supabase, commentId);
    if (!ok) {
      setError(t.communityFeed.actionFailed);
      return;
    }

    const rows = await fetchCommunityComments(supabase, postId);
    setComments(rows);
    onCommentsCountChange?.(rows.length);
  }

  if (!open) return null;

  return (
    <ModalPortal open={open}>
      <div className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center">
        <button
          type="button"
          aria-label={t.auth.close}
          className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"
          onClick={onClose}
        />

        <div
          role="dialog"
          aria-modal="true"
          className="relative z-10 m-4 flex max-h-[min(92dvh,760px)] w-[min(100%,42rem)] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
            <h2 className="text-lg font-bold text-black dark:text-white">{t.communityFeed.commentsTitle}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={t.auth.close}
              className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {loading ? (
              <p className="text-sm text-zinc-500">{t.communityFeed.loadingComments}</p>
            ) : comments.length === 0 ? (
              <p className="text-sm text-zinc-500">{t.communityFeed.noComments}</p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => {
                  const label = comment.display_name?.trim() || comment.username;
                  return (
                    <div key={comment.id} className="flex gap-3">
                      <Link
                        href={`/channel/${comment.username}`}
                        className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
                      >
                        {comment.avatar_url ? (
                          <Image src={comment.avatar_url} alt={label} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-bold text-zinc-500">
                            {getInitials(label)}
                          </div>
                        )}
                      </Link>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link href={`/channel/${comment.username}`} className="text-sm font-semibold text-black dark:text-white">
                            {label}
                          </Link>
                          {comment.is_verified ? <VerifiedBadge size="sm" /> : null}
                          <span className="text-xs text-zinc-500">
                            {new Date(comment.created_at).toLocaleString()}
                          </span>
                          {user?.id === comment.user_id ? (
                            <button
                              type="button"
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-xs text-red-500 hover:underline"
                            >
                              {t.communityFeed.deleteComment}
                            </button>
                          ) : null}
                        </div>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-200">
                          {comment.body}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {user ? (
            <form onSubmit={handleSubmit} className="border-t border-zinc-200 p-4 dark:border-zinc-800">
              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                rows={3}
                maxLength={500}
                placeholder={t.communityFeed.commentPlaceholder}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-accent dark:border-zinc-700 dark:bg-black dark:text-white"
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                {error ? <p className="text-xs text-red-500">{error}</p> : <span />}
                <button
                  type="submit"
                  disabled={posting || !body.trim()}
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {posting ? t.communityFeed.postingComment : t.communityFeed.postComment}
                </button>
              </div>
            </form>
          ) : (
            <p className="border-t border-zinc-200 p-4 text-sm text-zinc-500 dark:border-zinc-800">
              {t.communityFeed.loginToComment}
            </p>
          )}
        </div>
      </div>
    </ModalPortal>
  );
}
