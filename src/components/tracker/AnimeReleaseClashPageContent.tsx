"use client";

import Image from "next/image";
import Link from "next/link";
import { VideoCard } from "@/components/VideoCard";
import type { AnimeReleaseClashDetail } from "@/lib/animeTracker";
import { localizedAnimeTitle } from "@/lib/animeTracker";
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
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <Link href="/tracker" className="text-sm text-violet-300 hover:text-violet-200">
        ← {t.animeTracker.backToTracker}
      </Link>

      <header className="mt-4 overflow-hidden rounded-3xl border border-orange-500/25 bg-gradient-to-br from-orange-950/50 via-red-950/30 to-zinc-950 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {clash.posterUrl ? (
            <Image
              src={clash.posterUrl}
              alt={title}
              width={120}
              height={170}
              className="h-[170px] w-[120px] rounded-2xl object-cover shadow-xl"
              unoptimized
            />
          ) : null}
          <div>
            <span className="inline-flex rounded-full bg-orange-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-orange-200">
              {t.animeTracker.liveClashBadge}
            </span>
            <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">{title}</h1>
            <p className="mt-2 text-sm text-zinc-300">
              {t.animeTracker.episodeLabel.replace("{episode}", String(clash.episodeNumber))}
            </p>
            <p className="mt-3 max-w-xl text-sm text-orange-100">{t.animeTracker.clashSubtitle}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="rounded-full border border-orange-500/30 px-3 py-1 text-xs text-orange-100">
                {t.animeTracker.clipCount.replace("{count}", formatNumber(clash.clipCount))}
              </span>
              <Link
                href="/upload"
                className="rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-orange-700"
              >
                {t.animeTracker.uploadClip}
              </Link>
            </div>
            {clash.matchTags.length > 0 ? (
              <p className="mt-4 text-xs text-zinc-400">
                {t.animeTracker.matchTagsHint.replace("{tags}", clash.matchTags.map((tag) => `#${tag}`).join(" "))}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <section className="mt-8">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-amber-200">
          {t.animeTracker.leaderboardTitle}
        </h2>
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
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">
            <p className="text-sm text-zinc-400">{t.animeTracker.noClipsYet}</p>
            <Link
              href="/upload"
              className="mt-4 inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white"
            >
              {t.animeTracker.uploadClip}
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
