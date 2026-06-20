"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

type AdminCommunityPost = {
  id: string;
  body: string | null;
  image_url: string | null;
  created_at: string;
  user_id: string;
  likes_count: number;
  dislikes_count: number;
  comments_count: number;
  shares_count: number;
  owner_username?: string | null;
};

export function AdminCommunityPanel() {
  const { user } = useAuth();
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [posts, setPosts] = useState<AdminCommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      .limit(100);

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    const rows = data ?? [];
    const userIds = [...new Set(rows.map((row) => row.user_id))];
    const { data: profiles } = userIds.length
      ? await supabase.from("profiles").select("id, username").in("id", userIds)
      : { data: [] as Array<{ id: string; username: string }> };

    const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile.username]));

    setPosts(
      rows.map((row) => ({
        ...row,
        likes_count: row.likes_count ?? 0,
        dislikes_count: row.dislikes_count ?? 0,
        comments_count: row.comments_count ?? 0,
        shares_count: row.shares_count ?? 0,
        owner_username: profileMap.get(row.user_id) ?? null,
      })),
    );
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  async function deletePost(postId: string) {
    if (!supabase || !user) return;
    if (!window.confirm(t.admin.confirmDeleteCommunityPost)) return;

    setMessage(null);
    setError(null);

    const { error: deleteError } = await supabase.from("community_posts").delete().eq("id", postId);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setMessage(t.admin.deleted);
    await loadPosts();
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.admin.communityTitle}</h1>
        <p className="mt-2 text-sm text-zinc-400">{t.admin.communitySubtitle}</p>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-400">{t.admin.loading}</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 lg:grid-cols-[120px_1fr_auto]"
            >
              <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-zinc-800">
                {post.image_url ? (
                  <Image src={post.image_url} alt="" fill className="object-cover" unoptimized />
                ) : (
                  <div className="flex h-full w-full items-center justify-center px-2 text-center text-[10px] text-zinc-500">
                    {post.body?.slice(0, 60) || "—"}
                  </div>
                )}
              </div>

              <div className="min-w-0 space-y-2">
                <p className="text-sm text-zinc-200">{post.body || t.admin.imageOnlyPost}</p>
                <p className="text-xs text-zinc-500">
                  @{post.owner_username ?? "unknown"} · {new Date(post.created_at).toLocaleString()}
                </p>
                <p className="text-xs text-zinc-500">
                  👍 {post.likes_count} · 👎 {post.dislikes_count} · 💬 {post.comments_count} · ↗{" "}
                  {post.shares_count}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 lg:flex-col lg:items-stretch">
                <Link
                  href={`/community/post/${post.id}`}
                  className="rounded-lg border border-zinc-700 px-3 py-2 text-center text-xs font-semibold text-zinc-200 hover:border-zinc-500"
                >
                  {t.admin.preview}
                </Link>
                <button
                  type="button"
                  onClick={() => deletePost(post.id)}
                  className="rounded-lg border border-red-900 px-3 py-2 text-xs font-semibold text-red-300 hover:border-red-700"
                >
                  {t.admin.delete}
                </button>
              </div>
            </article>
          ))}

          {posts.length === 0 && (
            <p className="rounded-2xl border border-zinc-800 p-6 text-sm text-zinc-400">
              {t.admin.noCommunityPosts}
            </p>
          )}
        </div>
      )}

      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
