"use client";

import Link from "next/link";
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
    <section className="mb-8">
      <Link
        href={`/tracker/clash/${clash.clashId}`}
        className="group block overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-950/50 via-fuchsia-950/30 to-orange-950/40 p-4 transition hover:border-violet-400/50 sm:p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300">
              {t.animeTracker.bannerBadge}
            </p>
            <p className="mt-1 text-base font-bold text-white sm:text-lg">
              {t.animeTracker.bannerTitle.replace("{title}", title)}
            </p>
          </div>
          <span className="rounded-full bg-orange-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-md shadow-orange-500/30">
            {t.animeTracker.enterClash}
          </span>
        </div>
      </Link>
    </section>
  );
}
