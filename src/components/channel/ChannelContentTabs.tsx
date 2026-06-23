"use client";

import { useLocale } from "@/providers/LocaleProvider";

export type ChannelTab = "videos" | "community" | "about";

type ChannelContentTabsProps = {
  activeTab: ChannelTab;
  onTabChange: (tab: ChannelTab) => void;
  videoCount: number;
  communityPostCount: number;
};

export function ChannelContentTabs({
  activeTab,
  onTabChange,
  videoCount,
  communityPostCount,
}: ChannelContentTabsProps) {
  const { t, formatNumber } = useLocale();

  const tabs: { id: ChannelTab; label: string; count?: number }[] = [
    { id: "videos", label: t.profile.channelVideos, count: videoCount },
    { id: "community", label: t.profile.channelCommunity, count: communityPostCount },
    { id: "about", label: t.profile.channelAboutTab },
  ];

  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex flex-wrap gap-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`inline-flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-bold transition-colors ${
                isActive
                  ? "border-black text-black dark:border-white dark:text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              {tab.label}
              {typeof tab.count === "number" ? (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    isActive
                      ? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                      : "bg-zinc-50 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400"
                  }`}
                >
                  {formatNumber(tab.count)}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
