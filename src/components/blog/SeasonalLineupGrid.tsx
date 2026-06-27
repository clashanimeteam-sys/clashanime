"use client";

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
};

const CATEGORY_KEYS = ["new", "returning", "continuing", "coming-soon"] as const;

export function SeasonalLineupGrid({ entries, compact = false, maxItems }: SeasonalLineupGridProps) {
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

  let shown = 0;

  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
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
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-zinc-500">
              {categoryLabel(categoryKey)} · {visible.length}
            </p>
            <div
              className={
                compact
                  ? "grid max-h-72 gap-2 overflow-y-auto pr-1 sm:grid-cols-2"
                  : "grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
              }
            >
              {visible.map((entry) => (
                <div
                  key={`${categoryKey}-${entry.title}`}
                  className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 px-3 py-2.5"
                >
                  <p className="text-sm font-semibold leading-snug text-zinc-100">{entry.title}</p>
                  <p className="mt-1 text-[11px] text-zinc-500">
                    {entry.weekday
                      ? `${entry.weekday} · ${t.blog.seasonalGuide.weeklySimulcast}`
                      : formatSeasonalPremiereDate(
                          entry.premiereDate,
                          locale,
                          t.blog.seasonalGuide.comingSoon,
                        )}
                  </p>
                </div>
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
