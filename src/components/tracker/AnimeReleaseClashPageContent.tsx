"use client";

import Image from "next/image";
import Link from "next/link";
import { VideoCard } from "@/components/VideoCard";
import type { AnimeReleaseClashDetail } from "@/lib/animeTracker";
import { buildClashUploadHref, localizedAnimeTitle } from "@/lib/animeTracker";
import { AnimeSynopsisBlock } from "@/components/tracker/AnimeSynopsisBlock";
import type { Video } from "@/lib/types";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";

type AnimeReleaseClashPageContentProps = {
  clash: AnimeReleaseClashDetail;
  videos: Array<Video & { clashRank: number }>;
};

export function AnimeReleaseClashPageContent({ clash, videos }: AnimeReleaseClashPageContentProps) {
  const { t, locale, formatNumber } = useLocale();
  const title = localizedAnimeTitle(
    {
      title: clash.animeTitle,
      titleAr: clash.titleAr,
      titleJa: clash.titleJa,
    },
    locale,
  );

  usePageTitle(title);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/tracker"
        className="inline-flex text-sm font-semibold text-violet-700 underline-offset-2 hover:underline dark:text-violet-300"
      >
        ← {t.animeTracker.backToTracker}
      </Link>

      <header className="mt-5 overflow-hidden rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6 shadow-lg dark:border-orange-500/30 dark:from-orange-950/50 dark:via-zinc-950 dark:to-red-950/30 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {clash.posterUrl ? (
            <Image
              src={clash.posterUrl}
              alt={title}
              width={120}
              height={170}
              className="h-[170px] w-[120px] shrink-0 rounded-2xl object-cover shadow-xl ring-1 ring-black/10 dark:ring-white/10"
              unoptimized
            />
          ) : null}
          <div className="min-w-0 flex-1">
            <span className="inline-flex rounded-lg bg-orange-500 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
              {t.animeTracker.liveClashBadge}
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-zinc-900 dark:text-white sm:text-4xl">
              {title}
            </h1>
            <p className="mt-2 text-base font-semibold text-zinc-600 dark:text-zinc-300">
              {t.animeTracker.episodeLabel.replace("{episode}", String(clash.episodeNumber))}
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-700 dark:text-orange-100">
              {t.animeTracker.clashSubtitle}
            </p>
            <AnimeSynopsisBlock synopsis={clash} variant="full" />
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="rounded-xl border border-orange-200 bg-white px-4 py-2 text-sm font-bold text-orange-800 dark:border-orange-500/40 dark:bg-zinc-900/60 dark:text-orange-200">
                {t.animeTracker.clipCount.replace("{count}", formatNumber(clash.clipCount))}
              </span>
              <Link
                href={buildClashUploadHref(clash.clashId)}
                className="rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-500/30 transition hover:brightness-110"
              >
                {t.animeTracker.uploadClip}
              </Link>
            </div>
            {clash.matchTags.length > 0 ? (
              <p className="mt-4 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300">
                {t.animeTracker.matchTagsHint.replace(
                  "{tags}",
                  clash.matchTags.map((tag) => `#${tag}`).join(" "),
                )}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <section className="mt-10">
        <div className="mb-5 border-s-4 border-amber-500 ps-4">
          <h2 className="font-display text-lg font-bold text-amber-800 dark:text-amber-200 sm:text-xl">
            {t.animeTracker.leaderboardTitle}
          </h2>
        </div>
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                rank={video.clashRank}
                clashMode
                showClashBadge
                feedMode="clash"
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center dark:border-zinc-700 dark:bg-zinc-900/50">
            <p className="text-base font-medium text-zinc-600 dark:text-zinc-300">
              {t.animeTracker.noClipsYet}
            </p>
            <Link
              href={buildClashUploadHref(clash.clashId)}
              className="mt-5 inline-flex rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3 text-sm font-bold text-white shadow-md"
            >
              {t.animeTracker.uploadClip}
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
