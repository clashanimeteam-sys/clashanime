"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { CommunityPostActions } from "@/components/CommunityPostActions";
import { CommunityReportModal } from "@/components/CommunityReportModal";
import { HunterLevelBadge } from "@/components/HunterLevelBadge";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import {
  deleteCommunityComment,
  fetchCommunityComments,
  fetchCommunityPost,
  postCommunityComment,
  type CommunityComment,
  type CommunityPostDetail,
} from "@/lib/communityEngagement";
import { createBrowserClient } from "@/lib/supabase/client";
import { getSignupUrl } from "@/lib/subscriptionGate";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

type CommunityPostPageContentProps = {
  postId: string;
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function CommunityPostPageContent({ postId }: CommunityPostPageContentProps) {
  const { user } = useAuth();
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);

  const [post, setPost] = useState<CommunityPostDetail | null>(null);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);

  const loadPage = useCallback(async () => {
    if (!supabase) return;

    setLoading(true);
    setError(null);

    const [postData, commentRows] = await Promise.all([
      fetchCommunityPost(supabase, postId),
      fetchCommunityComments(supabase, postId),
    ]);

    setPost(postData);
    setComments(commentRows);
    setLoading(false);
  }, [postId, supabase]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

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
    setPost((current) => (current ? { ...current, comments_count: counts.comments_count } : current));
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
    setPost((current) => (current ? { ...current, comments_count: rows.length } : current));
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="text-sm text-zinc-500">{t.communityFeed.loadingComments}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link href="/community" className="text-sm font-semibold text-accent hover:underline">
          ← {t.communityFeed.backToCommunity}
        </Link>
        <p className="mt-6 text-sm text-zinc-500">{t.communityFeed.postNotFound}</p>
      </div>
    );
  }

  const label = post.display_name?.trim() || post.username;
  const preview = post.body || t.communityFeed.imagePostPreview;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/community"
        className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
      >
        ← {t.communityFeed.backToCommunity}
      </Link>

      <article className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
        <div className="flex items-start gap-3">
          <Link
            href={`/channel/${post.username}`}
            className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
          >
            {post.avatar_url ? (
              <Image src={post.avatar_url} alt={label} fill className="object-cover" unoptimized />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-bold text-zinc-500">
                {getInitials(label)}
              </div>
            )}
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/channel/${post.username}`} className="font-semibold text-black hover:text-accent dark:text-white">
                {label}
              </Link>
              {post.is_verified ? <VerifiedBadge size="sm" /> : null}
              <HunterLevelBadge level={post.level} points={post.points} size="sm" showLabel={false} />
              <span className="text-xs text-zinc-500">{new Date(post.created_at).toLocaleString()}</span>
            </div>

            {post.body ? (
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                {post.body}
              </p>
            ) : null}

            {post.image_url ? (
              <div className="relative mt-3 aspect-video max-h-96 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
                <Image src={post.image_url} alt="" fill className="object-cover" unoptimized />
              </div>
            ) : null}

            <div className="mt-4">
              <CommunityPostActions
                postId={post.id}
                postPreview={preview}
                initialLikes={post.likes_count}
                initialDislikes={post.dislikes_count}
                initialComments={post.comments_count}
                initialShares={post.shares_count}
                commentsMode="page"
                onReportOpen={() => setReportOpen(true)}
                onCountsChange={(counts) => setPost((current) => (current ? { ...current, ...counts } : current))}
              />
            </div>
          </div>
        </div>
      </article>

      <section id="comments" className="mt-8 scroll-mt-24">
        <h1 className="text-2xl font-bold text-black dark:text-white">{t.communityFeed.commentsTitle}</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {post.comments_count.toLocaleString()} {t.communityFeed.commentsCountLabel}
        </p>

        <div className="mt-6 space-y-4">
          {comments.length === 0 ? (
            <p className="rounded-2xl border border-zinc-200 p-6 text-sm text-zinc-500 dark:border-zinc-800">
              {t.communityFeed.noComments}
            </p>
          ) : (
            comments.map((comment) => {
              const commentLabel = comment.display_name?.trim() || comment.username;
              return (
                <article
                  key={comment.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black"
                >
                  <div className="flex gap-3">
                    <Link
                      href={`/channel/${comment.username}`}
                      className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
                    >
                      {comment.avatar_url ? (
                        <Image src={comment.avatar_url} alt={commentLabel} fill className="object-cover" unoptimized />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-bold text-zinc-500">
                          {getInitials(commentLabel)}
                        </div>
                      )}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/channel/${comment.username}`}
                          className="text-sm font-semibold text-black dark:text-white"
                        >
                          {commentLabel}
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
                      <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-200">
                        {comment.body}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {user ? (
          <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
            <label className="block text-sm font-semibold text-black dark:text-white">
              {t.communityFeed.commentPlaceholder}
            </label>
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={4}
              maxLength={500}
              placeholder={t.communityFeed.commentPlaceholder}
              className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-accent dark:border-zinc-700 dark:bg-black dark:text-white"
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
          <p className="mt-6 rounded-2xl border border-zinc-200 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
            <Link
              href={getSignupUrl(`/community/post/${postId}`)}
              className="font-semibold text-accent hover:underline"
            >
              {t.auth.signUp}
            </Link>{" "}
            {t.communityFeed.loginToComment}
          </p>
        )}
      </section>

      <CommunityReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        postId={post.id}
        postPreview={preview}
      />
    </div>
  );
}
