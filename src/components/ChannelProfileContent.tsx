"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FollowButton } from "@/components/FollowButton";
import { VideoCard } from "@/components/VideoCard";
import { createBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";
import type { Profile, Video } from "@/lib/types";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type ChannelProfileContentProps = {
  username: string;
};

export function ChannelProfileContent({ username }: ChannelProfileContentProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChannel = useCallback(async () => {
    if (!supabase) return;

    setLoading(true);
    setError(null);

    const normalizedUsername = username.replace(/^@/, "").toLowerCase();

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", normalizedUsername)
      .maybeSingle();

    if (profileError || !profileData) {
      setError(profileError?.message ?? t.profile.channelNotFound);
      setLoading(false);
      return;
    }

    if (user && profileData.id === user.id) {
      router.replace("/profile");
      return;
    }

    const [{ count }, { data: videoData }] = await Promise.all([
      supabase
        .from("channel_follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", profileData.id),
      supabase
        .from("videos")
        .select(
          "id, title, thumbnail_url, video_url, likes_count, comments_count, created_at, hashtags, duration_seconds, user_id",
        )
        .eq("user_id", profileData.id)
        .order("created_at", { ascending: false }),
    ]);

    let following = false;
    if (user) {
      const { data: followRow } = await supabase
        .from("channel_follows")
        .select("follower_id")
        .eq("follower_id", user.id)
        .eq("following_id", profileData.id)
        .maybeSingle();

      following = Boolean(followRow);
    }

    setProfile(profileData);
    setFollowerCount(count ?? 0);
    setIsFollowing(following);
    setVideos(
      (videoData ?? []).map((video) => ({
        ...video,
        trending_score: 0,
      })),
    );
    setLoading(false);
  }, [supabase, username, user, router, t.profile.channelNotFound]);

  useEffect(() => {
    if (authLoading) return;
    loadChannel();
  }, [authLoading, loadChannel]);

  if (loading || authLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{t.profile.loadingChannel}</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-sm text-red-500" role="alert">
          {error ?? t.profile.channelNotFound}
        </p>
      </div>
    );
  }

  const displayName = profile.display_name ?? profile.username;

  return (
    <div className="mx-auto max-w-6xl bg-white dark:bg-black">
      <div className="relative h-40 overflow-hidden bg-zinc-200 sm:h-52 dark:bg-zinc-900">
        {profile.banner_url ? (
          <Image
            src={profile.banner_url}
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
        ) : null}
      </div>

      <div className="px-4 pb-10 sm:px-6">
        <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white bg-zinc-200 sm:h-28 sm:w-28 dark:border-black dark:bg-zinc-900">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={displayName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-bold text-zinc-500">
                  {getInitials(displayName)}
                </div>
              )}
            </div>

            <div className="min-w-0 pt-12 sm:pt-14">
              <h1 className="text-2xl font-bold leading-tight text-black sm:text-3xl dark:text-white">
                {displayName}
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">@{profile.username}</p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {videos.length} {t.profile.videosCount}
              </p>
              {profile.bio ? (
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {profile.bio}
                </p>
              ) : null}
            </div>
          </div>

          <div className="pt-12 sm:pt-14">
            <FollowButton
              channelId={profile.id}
              initialFollowing={isFollowing}
              initialFollowerCount={followerCount}
              onFollowerCountChange={setFollowerCount}
            />
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-black dark:text-white">{t.profile.channelVideos}</h2>
          {videos.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{t.profile.noChannelVideos}</p>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {videos.map((video, index) => (
                <VideoCard key={video.id} video={video} rank={index + 1} />
              ))}
            </div>
          )}
        </div>

        {user && (
          <p className="mt-8 text-center text-sm text-zinc-500">
            <Link href="/profile" className="underline hover:text-black dark:hover:text-white">
              {t.profile.manageChannel}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
