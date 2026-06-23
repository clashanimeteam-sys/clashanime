"use client";

import { getTrendingSpotlight } from "@/lib/animeTrendingSpotlight";
import { useLocale } from "@/providers/LocaleProvider";

export function TrendingSpotlightSection() {
  const { locale, formatNumber } = useLocale();
  const { sectionTitle, entries } = getTrendingSpotlight(locale);

  return (
    <section className="mb-12">
      <div className="mb-5 border-s-4 border-amber-500 ps-4">
        <h2 className="font-display text-lg font-bold tracking-wide text-amber-900 dark:text-amber-200 sm:text-xl">
          {sectionTitle}
        </h2>
      </div>

      <ol className="grid gap-4">
        {entries.map((entry) => (
          <li
            key={entry.rank}
            className="flex gap-4 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4 shadow-sm dark:border-amber-500/30 dark:from-amber-950/40 dark:via-zinc-950 dark:to-orange-950/20 sm:gap-5 sm:p-5"
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-lg font-bold text-white shadow-md shadow-amber-500/30"
              aria-hidden
            >
              {formatNumber(entry.rank)}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-base font-bold leading-snug text-zinc-900 dark:text-white sm:text-lg">
                {entry.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-base">
                {entry.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
