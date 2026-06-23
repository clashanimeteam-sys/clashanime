"use client";

import Link from "next/link";
import { useState } from "react";
import { ChannelAboutSection } from "@/components/channel/ChannelAboutSection";
import { ChannelCommunityPosts, type ChannelCommunityPost } from "@/components/channel/ChannelCommunityPosts";
import { ChannelContentTabs, type ChannelTab } from "@/components/channel/ChannelContentTabs";
import { ChannelHero } from "@/components/channel/ChannelHero";
import { VideoCard } from "@/components/VideoCard";
import { useLocale } from "@/providers/LocaleProvider";
import type { Profile, Video } from "@/lib/types";

type ProfileChannelPreviewProps = {
  profile: Profile;
  followerCount: number;
  videos: Video[];
  communityPosts: ChannelCommunityPost[];
  onEditSettings?: () => void;
  showEditBar?: boolean;
};

export function ProfileChannelPreview({
  profile,
  followerCount,
  videos,
  communityPosts,
  onEditSettings,
  showEditBar = true,
}: ProfileChannelPreviewProps) {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<ChannelTab>("videos");
  const totalViews = videos.reduce((sum, video) => sum + (video.views_count ?? 0), 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-black dark:text-white">{t.profile.channelPreviewTitle}</h2>
        </div>
        {showEditBar ? (
          <div className="flex flex-wrap gap-2">
            {onEditSettings ? (
              <button
                type="button"
                onClick={onEditSettings}
                className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900"
              >
                {t.profile.editChannelSettings}
              </button>
            ) : null}
            <Link
              href={`/channel/${profile.username}`}
              className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
            >
              {t.profile.viewPublicChannel}
            </Link>
          </div>
        ) : null}
      </div>

      <ChannelHero
        profile={profile}
        followerCount={followerCount}
        videoCount={videos.length}
        communityPostCount={communityPosts.length}
      />

      <ChannelContentTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        videoCount={videos.length}
        communityPostCount={communityPosts.length}
      />

      {activeTab === "videos" ? (
        videos.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{t.profile.noChannelVideos}</p>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {videos.map((video, index) => (
              <VideoCard key={video.id} video={video} rank={index + 1} compact feedMode="catalog" />
            ))}
          </div>
        )
      ) : activeTab === "community" ? (
        <ChannelCommunityPosts posts={communityPosts} />
      ) : (
        <ChannelAboutSection
          profile={profile}
          stats={{
            followerCount,
            videoCount: videos.length,
            totalViews,
          }}
          showReportAction={false}
        />
      )}
    </div>
  );
}
