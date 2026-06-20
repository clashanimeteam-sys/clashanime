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
  const { t } = useLocale();

  return (
    <section className="overflow-hidden rounded-2xl border border-amber-400/25 bg-gradient-to-br from-amber-500/10 via-zinc-950/40 to-orange-600/10 p-5 shadow-lg shadow-amber-500/10 backdrop-blur-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">
            {t.exclusives.dailyHallBadge}
          </p>
          <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
            {t.exclusives.dailyHallTitle}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-zinc-300">{t.exclusives.dailyHallSubtitle}</p>
        </div>
        <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-200">
          👑 {t.exclusives.interactionKing}
        </span>
      </div>

      {leader ? (
        <Link
          href={`/channel/${leader.username}`}
          className="mt-5 flex items-center gap-4 rounded-2xl border border-white/10 bg-black/35 p-4 transition-colors hover:border-amber-400/40 hover:bg-black/50"
        >
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-amber-400/50 bg-zinc-900">
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
              <span className="flex h-full w-full items-center justify-center text-lg font-bold text-amber-200">
                {(leader.displayName ?? leader.username).slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-white">
              {leader.displayName ?? leader.username}
            </p>
            <p className="truncate text-sm text-zinc-400">@{leader.username}</p>
          </div>

          <div className="shrink-0 text-end">
            <HunterLevelBadge level={leader.level} points={leader.pointsToday} size="sm" showLabel={false} />
            <p className="mt-2 text-sm font-semibold text-amber-200">
              +{leader.pointsToday.toLocaleString()} {t.exclusives.pointsToday}
            </p>
          </div>
        </Link>
      ) : (
        <p className="mt-5 rounded-2xl border border-dashed border-white/15 bg-black/20 px-4 py-6 text-sm text-zinc-400">
          {t.exclusives.noDailyLeader}
        </p>
      )}
    </section>
  );
}
