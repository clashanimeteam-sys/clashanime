"use client";

import { useMemo, useState } from "react";
import { formatPrizeUsd, getSeasonPrizes, type ClashSeason } from "@/lib/clashSeasons";
import { useLocale } from "@/providers/LocaleProvider";

type CashPrizeRankButtonsProps = {
  season: ClashSeason | null;
};

const RANK_THEMES = {
  1: {
    pulse: "animate-[prize-rank-pulse-gold_2.4s_ease-in-out_infinite]",
    shell:
      "border-yellow-300/55 bg-gradient-to-br from-yellow-300/25 via-amber-500/20 to-yellow-700/25 text-yellow-50",
    activeShell:
      "border-yellow-200 bg-gradient-to-br from-yellow-300/45 via-amber-400/35 to-yellow-700/35 shadow-[0_0_36px_rgba(251,191,36,0.55)]",
    numberGlow: "text-yellow-100 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]",
    reveal: "from-yellow-500/25 via-amber-500/15 to-yellow-700/25 border-yellow-300/45 text-yellow-100",
    glow: "shadow-[0_0_44px_rgba(251,191,36,0.4)]",
    emoji: "🥇",
  },
  2: {
    pulse: "animate-[prize-rank-pulse-silver_2.6s_ease-in-out_infinite_0.3s]",
    shell:
      "border-slate-200/45 bg-gradient-to-br from-slate-200/20 via-zinc-300/15 to-slate-600/20 text-slate-50",
    activeShell:
      "border-slate-100 bg-gradient-to-br from-slate-200/40 via-zinc-300/30 to-slate-700/30 shadow-[0_0_30px_rgba(203,213,225,0.45)]",
    numberGlow: "text-slate-50 drop-shadow-[0_0_10px_rgba(203,213,225,0.7)]",
    reveal: "from-slate-400/20 via-zinc-500/12 to-slate-700/18 border-slate-300/40 text-slate-100",
    glow: "shadow-[0_0_36px_rgba(203,213,225,0.28)]",
    emoji: "🥈",
  },
  3: {
    pulse: "animate-[prize-rank-pulse-bronze_2.8s_ease-in-out_infinite_0.6s]",
    shell:
      "border-orange-400/45 bg-gradient-to-br from-orange-500/20 via-amber-700/15 to-orange-900/20 text-orange-50",
    activeShell:
      "border-orange-300 bg-gradient-to-br from-orange-500/40 via-amber-700/28 to-orange-900/30 shadow-[0_0_30px_rgba(249,115,22,0.45)]",
    numberGlow: "text-orange-50 drop-shadow-[0_0_10px_rgba(249,115,22,0.7)]",
    reveal: "from-orange-500/20 via-amber-700/12 to-orange-900/18 border-orange-400/40 text-orange-100",
    glow: "shadow-[0_0_36px_rgba(249,115,22,0.28)]",
    emoji: "🥉",
  },
} as const;

export function CashPrizeRankButtons({ season }: CashPrizeRankButtonsProps) {
  const { t, locale } = useLocale();
  const [revealedRank, setRevealedRank] = useState<1 | 2 | 3 | null>(null);
  const prizes = useMemo(() => getSeasonPrizes(season), [season]);

  const ranks = [
    { rank: 1 as const, cents: prizes.rank1Cents },
    { rank: 2 as const, cents: prizes.rank2Cents },
    { rank: 3 as const, cents: prizes.rank3Cents },
  ];

  const activeReveal = ranks.find((entry) => entry.rank === revealedRank);

  return (
    <div className="flex w-full flex-col items-end gap-3">
      <div className="flex flex-wrap justify-end gap-3">
        {ranks.map(({ rank }) => {
          const theme = RANK_THEMES[rank];
          const isActive = revealedRank === rank;

          return (
            <button
              key={rank}
              type="button"
              onClick={() => setRevealedRank(isActive ? null : rank)}
              aria-expanded={isActive}
              aria-label={t.home.cashPrizeRevealLabel.replace("{rank}", String(rank))}
              className={`group relative min-w-[4.75rem] overflow-hidden rounded-2xl border backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 ${
                isActive ? theme.activeShell : theme.shell
              } ${theme.pulse}`}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.22),transparent_58%)]"
              />
              <span className="relative flex flex-col items-center px-4 py-2.5">
                <span className="text-[9px] font-bold uppercase tracking-[0.22em] opacity-80">
                  {t.home.cashPrizeRankWord}
                </span>
                <span
                  className={`font-display text-2xl font-black leading-none sm:text-3xl ${theme.numberGlow}`}
                >
                  {rank}
                  {t.home.cashPrizeRankSuffix ? (
                    <span className="ms-0.5 text-base sm:text-lg">{t.home.cashPrizeRankSuffix}</span>
                  ) : null}
                </span>
              </span>
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
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black/25 text-2xl animate-[prize-float_3s_ease-in-out_infinite]">
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
      ) : null}
    </div>
  );
}
