"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CommentThread, updateCommentInTree } from "@/components/CommentThread";
import { CommunityPostActions } from "@/components/CommunityPostActions";
import { CommunityReportModal } from "@/components/CommunityReportModal";
import { ComposerMediaButtons } from "@/components/ComposerMediaButtons";
import { HunterLevelBadge } from "@/components/HunterLevelBadge";
import { RichBodyContent } from "@/components/RichBodyContent";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { useRequireSubscription } from "@/hooks/useRequireSubscription";
import {
  fetchCommunityComments,
  fetchCommunityPost,
  pinCommunityComment,
  postCommunityComment,
  toggleCommunityCommentLike,
  unpinCommunityComment,
  type CommunityPostDetail,
} from "@/lib/communityEngagement";
import { createBrowserClient } from "@/lib/supabase/client";
import { getSignupUrl } from "@/lib/subscriptionGate";
import { appendStickerToken, bodyHasRenderableContent } from "@/lib/stickers";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";
import type { VideoComment } from "@/lib/types";

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
  const { requireSubscription } = useRequireSubscription();
  const { t, formatNumber, formatDateTime } = useLocale();
  usePageTitle(t.communityFeed.commentsTitle);
  const supabase = useMemo(() => createBrowserClient(), []);
  const inputRef = useRef<HTMLInputElement>(null);

  const [post, setPost] = useState<CommunityPostDetail | null>(null);
  const [comments, setComments] = useState<VideoComment[]>([]);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [pinnedCommentId, setPinnedCommentId] = useState<string | null>(null);
  const [commentBody, setCommentBody] = useState("");
  const [replyTo, setReplyTo] = useState<VideoComment | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);

  const loadComments = useCallback(async () => {
    if (!supabase) return;

    const data = await fetchCommunityComments(supabase, postId, user?.id);
    setComments(data.comments);
    setOwnerId(data.postOwnerId);
    setPinnedCommentId(data.pinnedCommentId);
  }, [postId, supabase, user?.id]);

  const loadPage = useCallback(async () => {
    if (!supabase) return;

    setLoading(true);
    setError(null);

    const postData = await fetchCommunityPost(supabase, postId);
    setPost(postData);
    setLoading(false);

    if (postData) {
      await loadComments();
    }
  }, [loadComments, postId, supabase]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  function handleCommentUpdate(commentId: string, patch: Partial<VideoComment>) {
    setComments((current) => updateCommentInTree(current, commentId, patch));
  }

  function handleReply(comment: VideoComment) {
    if (!requireSubscription()) return;

    setReplyTo(comment);
    inputRef.current?.focus();
  }

  function appendEmoji(emoji: string) {
    setCommentBody((current) => `${current}${emoji}`);
    inputRef.current?.focus();
  }

  function appendSticker(stickerId: string) {
    setCommentBody((current) => appendStickerToken(current, stickerId));
    inputRef.current?.focus();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !requireSubscription() || !user || !bodyHasRenderableContent(commentBody)) return;

    setPosting(true);
    setError(null);

    const counts = await postCommunityComment(
      supabase,
      postId,
      user.id,
      commentBody,
      replyTo?.id ?? null,
    );

    if (counts) {
      setCommentBody("");
      setReplyTo(null);
      setPost((current) => (current ? { ...current, comments_count: counts.comments_count } : current));
      await loadComments();
      inputRef.current?.focus();
    } else {
      setError(t.communityFeed.actionFailed);
    }

    setPosting(false);
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
  const replyLabel = replyTo
    ? `${t.video.replyingTo} ${replyTo.display_name?.trim() || replyTo.username}`
    : null;

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
              <span className="text-xs text-zinc-500">{formatDateTime(post.created_at)}</span>
            </div>

            {post.body ? (
              <RichBodyContent
                body={post.body}
                className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200"
              />
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
        <p className="text-sm text-zinc-500">
          {formatNumber(post.comments_count)} {t.communityFeed.commentsCountLabel}
        </p>

        <div className="mt-6">
          {comments.length === 0 ? (
            <p className="rounded-2xl border border-zinc-200 p-6 text-sm text-zinc-500 dark:border-zinc-800">
              {t.communityFeed.noComments}
            </p>
          ) : (
            <ul className="space-y-4">
              {comments.map((comment) => (
                <CommentThread
                  key={comment.id}
                  comment={comment}
                  ownerId={ownerId}
                  pinnedCommentId={pinnedCommentId}
                  onReply={handleReply}
                  onRefresh={loadComments}
                  onPinChange={setPinnedCommentId}
                  onCommentUpdate={handleCommentUpdate}
                  onToggleLike={(commentId, liked) =>
                    user
                      ? toggleCommunityCommentLike(supabase!, commentId, user.id, liked)
                      : Promise.resolve(null)
                  }
                  onPin={(commentId) =>
                    user && ownerId
                      ? pinCommunityComment(supabase!, postId, commentId, user.id)
                      : Promise.resolve(null)
                  }
                  onUnpin={() =>
                    user ? unpinCommunityComment(supabase!, postId, user.id) : Promise.resolve(false)
                  }
                />
              ))}
            </ul>
          )}
        </div>

        {user ? (
          <form
            onSubmit={handleSubmit}
            className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black"
          >
            {replyLabel ? (
              <div className="mb-3 flex items-center justify-between gap-2 text-xs font-semibold text-zinc-500">
                <span>{replyLabel}</span>
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="text-accent hover:underline"
                >
                  {t.auth.close}
                </button>
              </div>
            ) : null}

            <div className="relative flex items-center gap-2">
              <ComposerMediaButtons
                showEmojiPicker={showEmojiPicker}
                showStickerPicker={showStickerPicker}
                onToggleEmojiPicker={() => setShowEmojiPicker((open) => !open)}
                onToggleStickerPicker={() => setShowStickerPicker((open) => !open)}
                onEmojiPick={appendEmoji}
                onStickerPick={appendSticker}
              />

              <input
                ref={inputRef}
                value={commentBody}
                onChange={(event) => setCommentBody(event.target.value)}
                maxLength={500}
                placeholder={t.video.commentPlaceholder}
                className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-accent dark:border-zinc-700 dark:bg-black dark:text-white"
              />

              <button
                type="submit"
                disabled={posting || !bodyHasRenderableContent(commentBody)}
                className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {posting ? t.video.postingComment : t.video.postComment}
              </button>
            </div>

            {error ? (
              <p className="mt-2 text-xs text-red-500" role="alert">
                {error}
              </p>
            ) : null}
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
