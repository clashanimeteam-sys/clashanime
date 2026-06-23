"use client";

import Image from "next/image";
import Link from "next/link";
import { HashtagLinks } from "@/components/HashtagLinks";
import type { AnimeReleaseClash } from "@/lib/animeTracker";
import { localizedAnimeTitle } from "@/lib/animeTracker";
import { useLocale } from "@/providers/LocaleProvider";

type AnimeTrackerBannerProps = {
  clashes: AnimeReleaseClash[];
};

export function AnimeTrackerBanner({ clashes }: AnimeTrackerBannerProps) {
  const { t, locale } = useLocale();

  if (!clashes.length) return null;

  const clash = clashes[0];
  const title = localizedAnimeTitle(
    {
      title: clash.animeTitle,
      titleAr: clash.titleAr,
      titleJa: clash.titleJa,
    },
    locale,
  );

  return (
    <section className="mb-2 sm:mb-4">
      <Link
        href={`/tracker/clash/${clash.clashId}`}
        className="group relative block overflow-hidden rounded-2xl border border-zinc-700/90 bg-zinc-900 shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-white/5 transition hover:border-orange-500/40 hover:shadow-orange-500/10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/40 via-zinc-900 to-orange-950/30" aria-hidden />
        {clash.posterUrl ? (
          <div className="pointer-events-none absolute -end-6 top-1/2 h-32 w-24 -translate-y-1/2 opacity-20 blur-sm sm:end-4 sm:h-40 sm:w-28 sm:opacity-30 sm:blur-0">
            <Image
              src={clash.posterUrl}
              alt=""
              width={112}
              height={160}
              className="h-full w-full rounded-lg object-cover"
              unoptimized
            />
          </div>
        ) : null}

        <div className="relative flex flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 sm:py-6">
          <div className="min-w-0 flex-1 pe-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-orange-300/90">
              {t.animeTracker.bannerBadge}
            </p>
            <p className="mt-2 font-sans text-lg font-bold leading-snug text-white sm:text-xl">
              {t.animeTracker.bannerTitle.replace("{title}", title)}
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-900/30 transition group-hover:bg-orange-400">
            {t.animeTracker.enterClash}
          </span>
        </div>
      </Link>
      {clash.matchTags.length > 0 ? (
        <HashtagLinks
          tags={clash.matchTags.slice(0, 4)}
          className="mt-2 px-4 text-xs font-medium text-zinc-500 sm:px-0 dark:text-zinc-400"
          linkClassName="text-zinc-500 transition-colors hover:text-orange-400 hover:underline dark:text-zinc-400"
        />
      ) : null}
    </section>
  );
}
