"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrizeUsd } from "@/lib/clashSeasons";
import type { HallOfLegendsSeason } from "@/lib/hallOfLegends";
import { useLocale } from "@/providers/LocaleProvider";

type HallOfLegendsProps = {
  seasons: HallOfLegendsSeason[];
  compact?: boolean;
};

const RANK_MEDALS = ["🥇", "🥈", "🥉"] as const;

function WinnerAvatar({
  avatarUrl,
  label,
}: {
  avatarUrl: string | null;
  label: string;
}) {
  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-violet-400/70 bg-zinc-100 dark:border-violet-300/40 dark:bg-zinc-900">
      {avatarUrl ? (
        <Image src={avatarUrl} alt="" fill className="object-cover" sizes="48px" unoptimized />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-base font-extrabold text-violet-700 dark:text-violet-200">
          {label.slice(0, 1).toUpperCase()}
        </span>
      )}
    </div>
  );
}

export function HallOfLegends({ seasons, compact = false }: HallOfLegendsProps) {
  const { t, locale } = useLocale();

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-violet-300/70 bg-gradient-to-br from-violet-50 via-white to-fuchsia-100 shadow-md shadow-violet-200/40 dark:border-violet-400/25 dark:from-violet-500/10 dark:via-zinc-950/70 dark:to-fuchsia-600/10 dark:shadow-violet-500/10 ${
        compact ? "p-4 sm:p-5" : "p-5 sm:p-6"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-violet-800 dark:text-violet-300">
            {t.exclusives.hallOfLegendsBadge}
          </p>
          <h2
            className={`mt-1 font-extrabold tracking-tight text-zinc-900 dark:text-white ${
              compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
            }`}
          >
            {t.exclusives.hallOfLegendsTitle}
          </h2>
          {!compact ? (
            <p className="mt-3 max-w-2xl text-base font-medium leading-relaxed text-zinc-700 dark:text-zinc-200">
              {t.exclusives.hallOfLegendsSubtitle}
            </p>
          ) : null}
        </div>
        <span className="rounded-full border border-violet-400/60 bg-violet-100 px-3 py-1.5 text-sm font-bold text-violet-900 dark:border-violet-400/30 dark:bg-violet-400/10 dark:text-violet-100">
          🏆 {t.exclusives.hallOfLegendsBadge}
        </span>
      </div>

      {seasons.length === 0 ? (
        <p className="mt-5 rounded-2xl border border-dashed border-zinc-300 bg-white/70 px-4 py-6 text-base font-medium leading-relaxed text-zinc-600 dark:border-white/15 dark:bg-black/20 dark:text-zinc-300">
          {t.exclusives.noHallOfLegends}
        </p>
      ) : (
        <div className={`mt-5 grid gap-4 ${compact ? "md:grid-cols-2" : "lg:grid-cols-2"}`}>
          {seasons.map((season) => (
            <article
              key={season.seasonId}
              className="rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-black/45"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">{season.seasonName}</h3>
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
                  {new Date(season.seasonEndsAt).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="space-y-3">
                {season.winners.map((winner) => (
                  <div
                    key={`${season.seasonId}-${winner.rank}`}
                    className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/80 p-3 dark:border-white/5 dark:bg-black/30"
                  >
                    <span className="w-7 shrink-0 text-center text-lg" aria-hidden>
                      {RANK_MEDALS[winner.rank - 1] ?? `#${winner.rank}`}
                    </span>

                    <Link href={`/channel/${winner.username}`} className="shrink-0">
                      <WinnerAvatar
                        avatarUrl={winner.avatarUrl}
                        label={winner.displayName ?? winner.username}
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/channel/${winner.username}`}
                        className="block truncate text-sm font-extrabold text-zinc-900 hover:text-violet-700 dark:text-white dark:hover:text-violet-300"
                      >
                        {winner.displayName ?? winner.username}
                      </Link>
                      <p className="truncate text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                        @{winner.username}
                      </p>
                      {winner.videoTitle ? (
                        <p className="mt-1 truncate text-xs text-zinc-600 dark:text-zinc-300">
                          {winner.videoTitle}
                        </p>
                      ) : null}
                    </div>

                    <div className="shrink-0 text-end">
                      <p className="text-xs font-bold uppercase tracking-wide text-violet-700 dark:text-violet-300">
                        {t.exclusives.seasonWinnerRank.replace("{rank}", String(winner.rank))}
                      </p>
                      <p className="mt-1 text-sm font-extrabold text-emerald-700 dark:text-emerald-300">
                        {formatPrizeUsd(winner.prizeCents, locale)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
