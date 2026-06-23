"use client";

import { VideoCard } from "@/components/VideoCard";
import type { HashtagPageStats } from "@/lib/hashtags.server";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";
import type { Video } from "@/lib/types";

type HashtagPageContentProps = {
  stats: HashtagPageStats;
  videos: Video[];
};

export function HashtagPageContent({ stats, videos }: HashtagPageContentProps) {
  const { t, formatNumber } = useLocale();
  const title = `#${stats.tag}`;

  usePageTitle(title);

  const statsLine = t.hashtag.statsLine
    .replace("{videos}", formatNumber(stats.videoCount))
    .replace("{channels}", formatNumber(stats.channelCount));

  return (
    <div className="mx-auto max-w-[1920px] px-4 py-4 sm:px-6">
      <header className="mb-6 border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <h1 className="font-display text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-zinc-600 sm:text-base dark:text-zinc-400">{statsLine}</p>
        <div className="mt-4 inline-flex rounded-full border border-zinc-300 bg-zinc-100 px-4 py-1.5 text-sm font-semibold text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
          {t.hashtag.allTab}
        </div>
      </header>

      {videos.length === 0 ? (
        <p className="text-sm text-zinc-500">{t.hashtag.emptyVideos.replace("{tag}", stats.tag)}</p>
      ) : (
        <section
          aria-label={title}
          className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
        >
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} compact feedMode="catalog" />
          ))}
        </section>
      )}
    </div>
  );
}
