"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { HunterLevelBadge } from "@/components/HunterLevelBadge";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { createBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";
import { getSignupUrl } from "@/lib/subscriptionGate";

type CommunityPost = {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
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

export function CommunityPageContent() {
  const { user } = useAuth();
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    if (!supabase) return;

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("community_posts")
      .select("id, body, created_at, user_id")
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !user || !body.trim()) return;

    setPosting(true);
    setError(null);
    setMessage(null);

    const { error: insertError } = await supabase.from("community_posts").insert({
      user_id: user.id,
      body: body.trim(),
    });

    setPosting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setBody("");
    setMessage(t.points.communityPostSuccess);
    await loadPosts();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white">{t.pages.communityTitle}</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t.points.communitySubtitle}</p>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
          <label className="block text-sm font-semibold text-black dark:text-white">
            {t.points.communityPostLabel}
          </label>
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={4}
            maxLength={2000}
            placeholder={t.points.communityPostPlaceholder}
            className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-accent dark:border-zinc-700 dark:bg-black dark:text-white"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs text-zinc-500">{t.points.communityPostReward}</p>
            <button
              type="submit"
              disabled={posting || !body.trim()}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {posting ? t.points.communityPosting : t.points.communityPostSubmit}
            </button>
          </div>
        </form>
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
            return (
              <article
                key={post.id}
                className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black"
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
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                      {post.body}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
