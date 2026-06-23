"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChannelCommunityPosts, type ChannelCommunityPost } from "@/components/channel/ChannelCommunityPosts";
import { ChannelContentTabs, type ChannelTab } from "@/components/channel/ChannelContentTabs";
import { ChannelHero } from "@/components/channel/ChannelHero";
import { FollowButton } from "@/components/FollowButton";
import { PageBackLink } from "@/components/PageBackLink";
import { VideoCard } from "@/components/VideoCard";
import { profileToVideoChannel } from "@/components/VideoCardChannel";
import { createBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";
import type { Profile, Video } from "@/lib/types";

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
  const [communityPosts, setCommunityPosts] = useState<ChannelCommunityPost[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<ChannelTab>("videos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageTitle = profile?.display_name ?? profile?.username ?? username;
  usePageTitle(pageTitle);

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

    const [{ count }, { data: videoData }, { data: postData }] = await Promise.all([
      supabase
        .from("channel_follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", profileData.id),
      supabase
        .from("videos")
        .select(
          "id, title, thumbnail_url, video_url, likes_count, comments_count, views_count, shares_count, created_at, hashtags, duration_seconds, user_id, moderation_status",
        )
        .eq("user_id", profileData.id)
        .eq("moderation_status", "approved")
        .order("created_at", { ascending: false }),
      supabase
        .from("community_posts")
        .select(
          "id, body, image_url, created_at, likes_count, dislikes_count, comments_count, shares_count",
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
        channel: profileToVideoChannel(profileData, count ?? 0),
      })),
    );
    setCommunityPosts((postData ?? []) as ChannelCommunityPost[]);
    setLoading(false);
  }, [supabase, username, user, router, t.profile.channelNotFound]);

  useEffect(() => {
    if (authLoading) return;
    loadChannel();
  }, [authLoading, loadChannel]);

  if (loading || authLoading) {
    return (
      <div className="mx-auto max-w-[1920px] px-4 py-16 sm:px-6">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{t.profile.loadingChannel}</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-[1920px] px-4 py-16 sm:px-6">
        <p className="text-sm text-red-500" role="alert">
          {error ?? t.profile.channelNotFound}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1920px] bg-white px-4 pb-10 dark:bg-black sm:px-6">
      <PageBackLink href="/videos" label={t.nav.videos} className="mb-4 pt-4" />

      <ChannelHero
        profile={profile}
        followerCount={followerCount}
        videoCount={videos.length}
        communityPostCount={communityPosts.length}
        actions={
          <FollowButton
            channelId={profile.id}
            initialFollowing={isFollowing}
            initialFollowerCount={followerCount}
            onFollowerCountChange={setFollowerCount}
          />
        }
      />

      <section className="mt-8">
        <ChannelContentTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          videoCount={videos.length}
          communityPostCount={communityPosts.length}
        />

        {activeTab === "videos" ? (
          videos.length === 0 ? (
            <p className="mt-5 text-sm text-zinc-600 dark:text-zinc-400">{t.profile.noChannelVideos}</p>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
              {videos.map((video, index) => (
                <VideoCard key={video.id} video={video} rank={index + 1} compact feedMode="catalog" />
              ))}
            </div>
          )
        ) : (
          <ChannelCommunityPosts posts={communityPosts} />
        )}
      </section>

      {user ? (
        <p className="mt-8 text-center text-sm text-zinc-500">
          <Link href="/profile" className="underline hover:text-black dark:hover:text-white">
            {t.profile.manageChannel}
          </Link>
        </p>
      ) : null}
    </div>
  );
}
