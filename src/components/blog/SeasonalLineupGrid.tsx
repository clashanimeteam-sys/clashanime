"use client";

import Image from "next/image";
import Link from "next/link";
import type { SeasonalLineupEntry } from "@/lib/animeNews/seasonalLineupTypes";
import {
  formatSeasonalPremiereDate,
  groupSeasonalLineup,
} from "@/lib/animeNews/seasonalLineupTypes";
import { useLocale } from "@/providers/LocaleProvider";

type SeasonalLineupGridProps = {
  entries: SeasonalLineupEntry[];
  compact?: boolean;
  maxItems?: number;
  showFullStory?: boolean;
};

const CATEGORY_KEYS = ["new", "returning", "continuing", "coming-soon"] as const;

function LineupCard({
  entry,
  locale,
  comingSoon,
  weeklySimulcast,
  storyHeading,
  showFullStory,
}: {
  entry: SeasonalLineupEntry;
  locale: string;
  comingSoon: string;
  weeklySimulcast: string;
  storyHeading: string;
  showFullStory: boolean;
}) {
  const dateLabel = entry.weekday
    ? `${entry.weekday} · ${weeklySimulcast}`
    : formatSeasonalPremiereDate(entry.premiereDate, locale, comingSoon);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/80 transition hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-950/20">
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">
        {entry.posterUrl ? (
          <Image
            src={entry.posterUrl}
            alt=""
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950 p-4 text-center">
            <span className="font-display text-sm font-bold leading-snug text-zinc-500">{entry.title}</span>
          </div>
        )}
        <span className="absolute start-2 top-2 rounded-full bg-black/75 px-2 py-0.5 text-[10px] font-bold text-orange-200 ring-1 ring-orange-500/30">
          {dateLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h5 className="font-display text-sm font-bold leading-snug text-white group-hover:text-orange-200">
          {entry.title}
        </h5>

        {entry.story ? (
          <div className="mt-2 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">{storyHeading}</p>
            <p
              className={`mt-1 text-xs leading-relaxed text-zinc-400 ${
                showFullStory ? "" : "line-clamp-4"
              }`}
            >
              {entry.story}
            </p>
          </div>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/tracker"
            className="inline-flex items-center gap-1 rounded-full border border-orange-500/40 px-3 py-1 text-[11px] font-semibold text-orange-200 transition hover:bg-orange-500/10"
          >
            <span aria-hidden>▶</span>
            Tracker
          </Link>
          {entry.malUrl ? (
            <a
              href={entry.malUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-zinc-700 px-3 py-1 text-[11px] font-semibold text-zinc-400 transition hover:text-zinc-200"
            >
              MAL
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function SeasonalLineupGrid({
  entries,
  compact = false,
  maxItems,
  showFullStory = false,
}: SeasonalLineupGridProps) {
  const { t, locale } = useLocale();
  const groups = groupSeasonalLineup(entries);
  const total = entries.length;

  if (total === 0) return null;

  const categoryLabel = (key: (typeof CATEGORY_KEYS)[number]) => {
    if (key === "new") return t.blog.seasonalGuide.categoryNew;
    if (key === "returning") return t.blog.seasonalGuide.categoryReturning;
    if (key === "continuing") return t.blog.seasonalGuide.categoryContinuing;
    return t.blog.seasonalGuide.categoryComingSoon;
  };

  const gridClass = compact
    ? "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
    : "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

  let shown = 0;

  return (
    <div className={compact ? "space-y-4" : "space-y-8"}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-display text-sm font-bold text-orange-200 sm:text-base">
          {t.blog.seasonalGuide.lineupHeading}
        </h4>
        <span className="rounded-full bg-orange-500/15 px-3 py-1 text-[11px] font-bold text-orange-200 ring-1 ring-orange-500/25">
          {t.blog.seasonalGuide.lineupCount.replace("{count}", String(total))}
        </span>
      </div>

      {CATEGORY_KEYS.map((categoryKey) => {
        const items = groups[categoryKey];
        if (items.length === 0) return null;

        const remaining = maxItems ? Math.max(maxItems - shown, 0) : items.length;
        if (maxItems && remaining === 0) return null;

        const visible = maxItems ? items.slice(0, remaining) : items;
        shown += visible.length;

        return (
          <div key={categoryKey}>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-zinc-500">
              {categoryLabel(categoryKey)} · {visible.length}
            </p>
            <div className={gridClass}>
              {visible.map((entry) => (
                <LineupCard
                  key={`${categoryKey}-${entry.title}`}
                  entry={entry}
                  locale={locale}
                  comingSoon={t.blog.seasonalGuide.comingSoon}
                  weeklySimulcast={t.blog.seasonalGuide.weeklySimulcast}
                  storyHeading={t.blog.animeNews.storyHeading}
                  showFullStory={showFullStory}
                />
              ))}
            </div>
          </div>
        );
      })}

      {maxItems && total > maxItems ? (
        <p className="text-xs text-zinc-500">
          {t.blog.seasonalGuide.moreTitles.replace("{count}", String(total - maxItems))}
        </p>
      ) : null}
    </div>
  );
}
