"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CommunityPostActions } from "@/components/CommunityPostActions";
import { CommunityReportModal } from "@/components/CommunityReportModal";
import { ComposerMediaButtons } from "@/components/ComposerMediaButtons";
import { MentionHashtagTextarea } from "@/components/MentionHashtagTextarea";
import { HunterLevelBadge } from "@/components/HunterLevelBadge";
import { RichBodyContent } from "@/components/RichBodyContent";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { deleteCommunityPost } from "@/lib/communityEngagement";
import { canPostToCommunity } from "@/lib/points";
import { appendStickerToken, bodyHasRenderableContent } from "@/lib/stickers";
import { createBrowserClient } from "@/lib/supabase/client";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { getSignupUrl } from "@/lib/subscriptionGate";
import { getPublicStorageUrl } from "@/lib/upload";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";

type CommunityPost = {
  id: string;
  body: string;
  image_url: string | null;
  created_at: string;
  user_id: string;
  likes_count: number;
  dislikes_count: number;
  comments_count: number;
  shares_count: number;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  is_verified?: boolean;
  level?: number;
  points?: number;
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function CommunityPageContent() {
  const router = useRouter();
  const { user, profile, profileLoading } = useAuth();
  const { t } = useLocale();
  usePageTitle(t.pages.communityTitle);
  const supabase = useMemo(() => createBrowserClient(), []);
  const config = useMemo(() => getSupabaseConfig(), []);

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [activeReportPost, setActiveReportPost] = useState<CommunityPost | null>(null);

  const loadPosts = useCallback(async () => {
    if (!supabase) return;

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("community_posts")
      .select(
        "id, body, image_url, created_at, user_id, likes_count, dislikes_count, comments_count, shares_count",
      )
      .order("created_at", { ascending: false })
      .limit(50);

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    const rows = data ?? [];
    const userIds = [...new Set(rows.map((row) => row.user_id))];

    const { data: profiles } = userIds.length
      ? await supabase
          .from("profiles")
          .select("id, username, display_name, avatar_url, is_verified, level, points")
          .in("id", userIds)
      : { data: [] as Array<{
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          is_verified?: boolean;
          level?: number;
          points?: number;
        }> };

    const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

    setPosts(
      rows.map((row) => {
        const profile = profileMap.get(row.user_id);
        return {
          ...row,
          body: row.body ?? "",
          image_url: row.image_url ?? null,
          likes_count: row.likes_count ?? 0,
          dislikes_count: row.dislikes_count ?? 0,
          comments_count: row.comments_count ?? 0,
          shares_count: row.shares_count ?? 0,
          username: profile?.username ?? "user",
          display_name: profile?.display_name ?? null,
          avatar_url: profile?.avatar_url ?? null,
          is_verified: profile?.is_verified,
          level: profile?.level,
          points: profile?.points,
        };
      }),
    );
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash.startsWith("#post-")) return;
    const id = hash.replace("#post-", "");
    router.replace(`/community/post/${id}`);
  }, [router]);

  function handleImageSelect(file: File | null) {
    setImageFile(null);
    setImagePreview(null);

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(t.communityFeed.invalidImage);
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setError(t.communityFeed.imageTooLarge);
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
  }

  async function uploadPostImage(file: File, userId: string): Promise<string | null> {
    if (!supabase || !config) return null;

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${userId}/${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("community-images")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) return null;
    return getPublicStorageUrl(config.url, "community-images", path);
  }

  const postUnlocked = canPostToCommunity(profile);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !user) return;

    if (!postUnlocked) {
      setError(t.communityFeed.postLevelRequired);
      return;
    }

    const trimmed = body.trim();
    if (!bodyHasRenderableContent(body) && !imageFile) return;

    if (!acceptedPolicy) {
      setError(t.communityFeed.policyRequired);
      return;
    }

    setPosting(true);
    setError(null);
    setMessage(null);

    let imageUrl: string | null = null;
    if (imageFile) {
      imageUrl = await uploadPostImage(imageFile, user.id);
      if (!imageUrl) {
        setError(t.communityFeed.uploadFailed);
        setPosting(false);
        return;
      }
    }

    const { error: insertError } = await supabase.from("community_posts").insert({
      user_id: user.id,
      body: trimmed || null,
      image_url: imageUrl,
    });

    setPosting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    if (trimmed) {
      void fetch("/api/notifications/mentions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: trimmed,
          link: "/community",
          title: t.notifications.mentionTitle,
          preview: t.notifications.mentionPreviewCommunity,
        }),
      });
    }

    setBody("");
    setImageFile(null);
    setImagePreview(null);
    setAcceptedPolicy(false);
    setMessage(t.communityFeed.postPublished);
    await loadPosts();
  }

  async function handleDeletePost(postId: string) {
    if (!supabase || !user) return;
    if (!window.confirm(t.communityFeed.confirmDeletePost)) return;

    const ok = await deleteCommunityPost(supabase, postId);
    if (!ok) {
      setError(t.communityFeed.actionFailed);
      return;
    }

    setPosts((current) => current.filter((post) => post.id !== postId));
  }

  function updatePostCounts(
    postId: string,
    counts: {
      likes_count: number;
      dislikes_count: number;
      comments_count: number;
      shares_count: number;
    },
  ) {
    setPosts((current) =>
      current.map((post) => (post.id === postId ? { ...post, ...counts } : post)),
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
      <div className="mb-6">
        <p className="rounded-xl border border-accent/20 bg-accent/5 px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300">
          {t.communityFeed.animeOnlyNotice}{" "}
          <Link href="/community-guidelines" className="font-semibold text-accent hover:underline">
            {t.footer.communityGuidelines}
          </Link>
        </p>
      </div>

      {user ? (
        postUnlocked ? (
        <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
          <label className="block text-sm font-semibold text-black dark:text-white">
            {t.points.communityPostLabel}
          </label>
          <MentionHashtagTextarea
            value={body}
            onChange={setBody}
            rows={4}
            maxLength={2000}
            placeholder={t.communityFeed.postPlaceholder}
            excludeUserId={user.id}
            className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-accent dark:border-zinc-700 dark:bg-black dark:text-white"
          />

          <div className="relative mt-2">
            <ComposerMediaButtons
              showEmojiPicker={showEmojiPicker}
              showStickerPicker={showStickerPicker}
              onToggleEmojiPicker={() => setShowEmojiPicker((open) => !open)}
              onToggleStickerPicker={() => setShowStickerPicker((open) => !open)}
              onEmojiPick={(emoji) => setBody((current) => `${current}${emoji}`)}
              onStickerPick={(stickerId) =>
                setBody((current) => appendStickerToken(current, stickerId))
              }
            />
          </div>

          {imagePreview ? (
            <div className="relative mt-3 aspect-video max-h-64 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
              <Image src={imagePreview} alt="" fill className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => handleImageSelect(null)}
                className="absolute end-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white"
              >
                {t.communityFeed.removeImage}
              </button>
            </div>
          ) : (
            <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-600 hover:border-accent dark:border-zinc-700 dark:text-zinc-300">
              {t.communityFeed.addImage}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleImageSelect(event.target.files?.[0] ?? null)}
              />
            </label>
          )}

          <label className="mt-4 flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
            <input
              type="checkbox"
              checked={acceptedPolicy}
              onChange={(event) => setAcceptedPolicy(event.target.checked)}
              className="mt-0.5"
              required
            />
            <span>
              {t.communityFeed.policyCheckbox}{" "}
              <Link href="/community-guidelines" className="font-semibold text-accent hover:underline">
                {t.footer.communityGuidelines}
              </Link>{" "}
              {t.communityFeed.policyCheckboxSuffix}
            </span>
          </label>

          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={posting || (!bodyHasRenderableContent(body) && !imageFile) || !acceptedPolicy}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {posting ? t.points.communityPosting : t.points.communityPostSubmit}
            </button>
          </div>
        </form>
        ) : profileLoading ? (
          <p className="mb-8 text-sm text-zinc-500">{t.points.communityLoading}</p>
        ) : (
          <p className="mb-8 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
            {t.communityFeed.postLevelRequired}
          </p>
        )
      ) : (
        <p className="mb-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          <Link href={getSignupUrl("/community")} className="font-semibold text-accent hover:underline">
            {t.auth.signUp}
          </Link>{" "}
          {t.points.communitySignupHint}
        </p>
      )}

      {message ? <p className="mb-4 text-sm text-emerald-600 dark:text-emerald-400">{message}</p> : null}
      {error ? (
        <p className="mb-4 text-sm text-red-500" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-zinc-500">{t.points.communityLoading}</p>
      ) : posts.length === 0 ? (
        <p className="rounded-2xl border border-zinc-200 p-6 text-sm text-zinc-500 dark:border-zinc-800">
          {t.points.communityEmpty}
        </p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const label = post.display_name?.trim() || post.username;
            const preview = post.body || t.communityFeed.imagePostPreview;
            return (
              <article
                key={post.id}
                id={`post-${post.id}`}
                className="scroll-mt-24 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black"
              >
                <div className="flex items-start gap-3">
                  <Link href={`/channel/${post.username}`} className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
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
                      <span className="text-xs text-zinc-500">
                        {new Date(post.created_at).toLocaleString()}
                      </span>
                      {user?.id === post.user_id ? (
                        <button
                          type="button"
                          onClick={() => handleDeletePost(post.id)}
                          className="text-xs font-semibold text-red-500 hover:underline"
                        >
                          {t.communityFeed.deletePost}
                        </button>
                      ) : null}
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
                        onReportOpen={() => setActiveReportPost(post)}
                        onCountsChange={(counts) => updatePostCounts(post.id, counts)}
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <CommunityReportModal
        open={Boolean(activeReportPost)}
        onClose={() => setActiveReportPost(null)}
        postId={activeReportPost?.id ?? ""}
        postPreview={activeReportPost?.body || activeReportPost?.image_url || undefined}
      />
    </div>
  );
}
