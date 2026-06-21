"use client";

import { useMemo, useState } from "react";
import { formatPrizeUsd, getSeasonPrizes, type ClashSeason } from "@/lib/clashSeasons";
import { useLocale } from "@/providers/LocaleProvider";

type CashPrizeRankButtonsProps = {
  season: ClashSeason | null;
};

const RANK_THEMES = {
  1: {
    ring: "border-yellow-300/50 bg-gradient-to-br from-yellow-400/20 via-amber-500/15 to-yellow-600/10 text-yellow-100",
    activeRing: "border-yellow-300 bg-gradient-to-br from-yellow-400/35 via-amber-500/25 to-yellow-700/20 shadow-[0_0_28px_rgba(251,191,36,0.45)]",
    reveal: "from-yellow-500/20 via-amber-500/10 to-yellow-700/20 border-yellow-300/40 text-yellow-100",
    glow: "shadow-[0_0_40px_rgba(251,191,36,0.35)]",
    emoji: "🥇",
  },
  2: {
    ring: "border-slate-300/40 bg-gradient-to-br from-slate-300/15 via-zinc-400/10 to-slate-500/10 text-slate-100",
    activeRing: "border-slate-200 bg-gradient-to-br from-slate-300/30 via-zinc-400/20 to-slate-600/15 shadow-[0_0_24px_rgba(203,213,225,0.35)]",
    reveal: "from-slate-400/15 via-zinc-500/10 to-slate-700/15 border-slate-300/35 text-slate-100",
    glow: "shadow-[0_0_32px_rgba(203,213,225,0.25)]",
    emoji: "🥈",
  },
  3: {
    ring: "border-orange-400/35 bg-gradient-to-br from-orange-500/15 via-amber-700/10 to-orange-900/10 text-orange-100",
    activeRing: "border-orange-300 bg-gradient-to-br from-orange-500/30 via-amber-700/20 to-orange-900/15 shadow-[0_0_24px_rgba(249,115,22,0.35)]",
    reveal: "from-orange-500/15 via-amber-700/10 to-orange-900/15 border-orange-400/35 text-orange-100",
    glow: "shadow-[0_0_32px_rgba(249,115,22,0.25)]",
    emoji: "🥉",
  },
} as const;

export function CashPrizeRankButtons({ season }: CashPrizeRankButtonsProps) {
  const { t, locale } = useLocale();
  const [revealedRank, setRevealedRank] = useState<1 | 2 | 3 | null>(null);
  const prizes = useMemo(() => getSeasonPrizes(season), [season]);

  const ranks = [
    { rank: 1 as const, cents: prizes.rank1Cents, label: t.home.cashPrizeRankNumber.replace("{rank}", "1") },
    { rank: 2 as const, cents: prizes.rank2Cents, label: t.home.cashPrizeRankNumber.replace("{rank}", "2") },
    { rank: 3 as const, cents: prizes.rank3Cents, label: t.home.cashPrizeRankNumber.replace("{rank}", "3") },
  ];

  const activeReveal = ranks.find((entry) => entry.rank === revealedRank);

  return (
    <div className="flex w-full flex-col items-end gap-3">
      <div className="flex flex-wrap justify-end gap-2">
        {ranks.map(({ rank, label }) => {
          const theme = RANK_THEMES[rank];
          const isActive = revealedRank === rank;

          return (
            <button
              key={rank}
              type="button"
              onClick={() => setRevealedRank(isActive ? null : rank)}
              aria-expanded={isActive}
              aria-label={t.home.cashPrizeRevealLabel.replace("{rank}", String(rank))}
              className={`rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] transition-all duration-300 hover:-translate-y-0.5 ${
                isActive ? theme.activeRing : theme.ring
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {activeReveal ? (
        <div
          key={activeReveal.rank}
          className={`w-full max-w-sm animate-[prize-reveal-pop_0.45s_ease-out] overflow-hidden rounded-2xl border bg-gradient-to-r p-4 backdrop-blur-md sm:max-w-md ${RANK_THEMES[activeReveal.rank].reveal} ${RANK_THEMES[activeReveal.rank].glow}`}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black/25 text-2xl">
              {RANK_THEMES[activeReveal.rank].emoji}
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
                {t.home.cashPrizeRevealLabel.replace("{rank}", String(activeReveal.rank))}
              </p>
              <p className="animate-[prize-shimmer_3s_linear_infinite] bg-gradient-to-r from-white via-amber-100 to-white bg-[length:200%_100%] bg-clip-text font-display text-3xl font-black tracking-tight text-transparent sm:text-4xl">
                {formatPrizeUsd(activeReveal.cents, locale)}
              </p>
              <p className="mt-1 text-xs opacity-85">{t.home.cashPrizeRevealHint}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-amber-200/60">
          {t.home.cashPrizeTapHint}
        </p>
      )}
    </div>
  );
}
