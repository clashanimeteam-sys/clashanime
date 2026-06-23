"use client";

import Image from "next/image";
import Link from "next/link";
import { HunterLevelBadge } from "@/components/HunterLevelBadge";
import { useLocale } from "@/providers/LocaleProvider";
import type { DailyHallLeader } from "@/lib/dailyHall";

type DailyHallOfFameProps = {
  leader: DailyHallLeader | null;
};

export function DailyHallOfFame({ leader }: DailyHallOfFameProps) {
  const { t, formatNumber, formatDateTime } = useLocale();

  return (
    <section className="overflow-hidden rounded-2xl border border-amber-300/80 bg-gradient-to-br from-amber-50 via-white to-orange-100 p-5 shadow-md shadow-amber-200/40 dark:border-amber-400/25 dark:from-amber-500/10 dark:via-zinc-950/70 dark:to-orange-600/10 dark:shadow-amber-500/10 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-amber-800 dark:text-amber-300">
            {t.exclusives.dailyHallBadge}
          </p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            {t.exclusives.dailyHallTitle}
          </h2>
          <p className="mt-3 max-w-xl text-base font-medium leading-relaxed text-zinc-700 dark:text-zinc-200">
            {t.exclusives.dailyHallSubtitle}
          </p>
        </div>
        <span className="rounded-full border border-amber-400/60 bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100">
          👑 {t.exclusives.interactionKing}
        </span>
      </div>

      {leader ? (
        <Link
          href={`/channel/${leader.username}`}
          className="mt-5 flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-sm transition-colors hover:border-amber-400/50 hover:bg-white dark:border-white/10 dark:bg-black/45 dark:hover:bg-black/55"
        >
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-amber-500/70 bg-zinc-100 dark:border-amber-400/50 dark:bg-zinc-900">
            {leader.avatarUrl ? (
              <Image
                src={leader.avatarUrl}
                alt=""
                fill
                className="object-cover"
                sizes="56px"
                unoptimized
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-lg font-extrabold text-amber-700 dark:text-amber-200">
                {(leader.displayName ?? leader.username).slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-extrabold text-zinc-900 dark:text-white">
              {leader.displayName ?? leader.username}
            </p>
            <p className="truncate text-sm font-semibold text-zinc-600 dark:text-zinc-300">
              @{leader.username}
            </p>
          </div>

          <div className="shrink-0 text-end">
            <HunterLevelBadge level={leader.level} points={leader.pointsToday} size="sm" />
            <p className="mt-2 text-base font-extrabold text-amber-800 dark:text-amber-200">
              +{formatNumber(leader.pointsToday)} {t.exclusives.pointsToday}
            </p>
          </div>
        </Link>
      ) : (
        <p className="mt-5 rounded-2xl border border-dashed border-zinc-300 bg-white/70 px-4 py-6 text-base font-medium leading-relaxed text-zinc-600 dark:border-white/15 dark:bg-black/20 dark:text-zinc-300">
          {t.exclusives.noDailyLeader}
        </p>
      )}
    </section>
  );
}
