"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { formatRelativeTime } from "@/lib/format";
import { fetchVideoComments, postVideoComment } from "@/lib/videoEngagement";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";
import type { VideoChannel, VideoComment } from "@/lib/types";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type VideoCommentsModalProps = {
  open: boolean;
  onClose: () => void;
  videoId: string;
  title: string;
  thumbnailUrl: string;
  videoUrl?: string;
  channel?: VideoChannel | null;
  hashtags?: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  liked: boolean;
  loadingLike: boolean;
  onLike: () => void;
  onShare: () => void;
  onCommentsCountChange: (count: number) => void;
};

export function VideoCommentsModal({
  open,
  onClose,
  videoId,
  title,
  thumbnailUrl,
  videoUrl,
  channel,
  hashtags,
  likesCount,
  commentsCount,
  sharesCount,
  liked,
  loadingLike,
  onLike,
  onShare,
  onCommentsCountChange,
}: VideoCommentsModalProps) {
  const { user } = useAuth();
  const { locale, t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const inputRef = useRef<HTMLInputElement>(null);

  const [comments, setComments] = useState<VideoComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    if (!supabase) return;

    setLoadingComments(true);
    const rows = await fetchVideoComments(supabase, videoId);
    setComments(rows);
    setLoadingComments(false);
  }, [supabase, videoId]);

  useEffect(() => {
    if (!open) return;

    void loadComments();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open, loadComments]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !user || !commentBody.trim()) return;

    setPosting(true);
    setError(null);

    const counts = await postVideoComment(supabase, videoId, user.id, commentBody);

    if (counts) {
      onCommentsCountChange(counts.comments_count);
      setCommentBody("");
      await loadComments();
      inputRef.current?.focus();
    } else {
      setError(t.video.actionFailed);
    }

    setPosting(false);
  }

  if (!open) return null;

  const channelLabel = channel?.display_name?.trim() || channel?.username;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t.video.comments}
      onClick={onClose}
    >
      <div
        className="flex h-[100dvh] w-full max-w-5xl flex-col overflow-hidden bg-white sm:h-[min(90dvh,760px)] sm:rounded-2xl dark:bg-black md:flex-row"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative flex min-h-0 w-full shrink-0 items-center justify-center bg-black md:h-auto md:w-[55%]">
          {videoUrl ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              playsInline
              muted
              poster={thumbnailUrl}
              className="max-h-[42dvh] w-full object-contain md:max-h-none md:h-full"
            />
          ) : (
            <div className="relative aspect-[9/16] max-h-[42dvh] w-full md:max-h-none md:h-full md:aspect-auto">
              <Image
                src={thumbnailUrl}
                alt={title}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col border-t border-zinc-200 md:border-t-0 md:border-s md:border-zinc-200 dark:border-zinc-800 dark:md:border-zinc-800">
          <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            {channel ? (
              <Link
                href={`/channel/${channel.username}`}
                className="flex min-w-0 flex-1 items-center gap-3"
                onClick={onClose}
              >
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  {channel.avatar_url ? (
                    <Image
                      src={channel.avatar_url}
                      alt={channelLabel ?? channel.username}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-zinc-500">
                      {getInitials(channelLabel ?? channel.username)}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-black dark:text-white">
                    {channelLabel}
                  </p>
                  <p className="truncate text-xs font-semibold text-zinc-500">@{channel.username}</p>
                </div>
              </Link>
            ) : (
              <p className="min-w-0 flex-1 truncate text-sm font-bold text-black dark:text-white">
                {title}
              </p>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label={t.auth.close}
              className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-black dark:hover:bg-zinc-900 dark:hover:text-white"
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
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            <div className="mb-4 border-b border-zinc-100 pb-4 dark:border-zinc-900">
              <p className="text-sm font-semibold leading-relaxed text-black dark:text-white">
                {title}
              </p>
              {hashtags && hashtags.length > 0 ? (
                <p className="mt-2 text-sm font-semibold text-zinc-500">
                  {hashtags.map((tag) => `#${tag}`).join(" ")}
                </p>
              ) : null}
            </div>

            {loadingComments ? (
              <p className="text-sm text-zinc-500">{t.auth.loading}</p>
            ) : comments.length === 0 ? (
              <p className="text-sm font-semibold text-zinc-500">{t.video.noComments}</p>
            ) : (
              <ul className="space-y-4">
                {comments.map((comment) => {
                  const name = comment.display_name?.trim() || comment.username;

                  return (
                    <li key={comment.id} className="flex gap-3">
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
                        <p className="text-sm leading-relaxed text-black dark:text-white">
                          <Link
                            href={`/channel/${comment.username}`}
                            className="me-2 font-bold hover:underline"
                            onClick={onClose}
                          >
                            {name}
                          </Link>
                          {comment.body}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-zinc-500">
                          {formatRelativeTime(comment.created_at, locale)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onLike}
                disabled={loadingLike}
                aria-pressed={liked}
                className={`transition-colors ${liked ? "text-accent" : "text-black dark:text-white"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6"
                  aria-hidden
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => inputRef.current?.focus()}
                className="text-black dark:text-white"
                aria-label={t.video.comments}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-6 w-6"
                  aria-hidden
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={onShare}
                className="text-black dark:text-white"
                aria-label={t.video.share}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-6 w-6"
                  aria-hidden
                >
                  <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
                  <path d="M16 6l-4-4-4 4" />
                  <path d="M12 2v14" />
                </svg>
              </button>

              <p className="ms-auto text-xs font-semibold text-zinc-500">
                {likesCount.toLocaleString()} {t.video.like} · {commentsCount.toLocaleString()}{" "}
                {t.video.comments} · {sharesCount.toLocaleString()} {t.video.share}
              </p>
            </div>

            {user ? (
              <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-900">
                <input
                  ref={inputRef}
                  value={commentBody}
                  onChange={(event) => setCommentBody(event.target.value)}
                  maxLength={500}
                  placeholder={t.video.commentPlaceholder}
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-black outline-none placeholder:text-zinc-400 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={posting || !commentBody.trim()}
                  className="shrink-0 text-sm font-bold text-accent disabled:opacity-40"
                >
                  {posting ? t.video.postingComment : t.video.postComment}
                </button>
              </form>
            ) : (
              <p className="border-t border-zinc-100 pt-3 text-sm font-semibold text-zinc-500 dark:border-zinc-900">
                <Link href="/login" className="text-accent hover:underline">
                  {t.auth.logIn}
                </Link>{" "}
                {t.video.loginToComment}
              </p>
            )}

            {error ? (
              <p className="mt-2 text-xs text-red-500" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
