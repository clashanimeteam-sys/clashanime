"use client";

import { CashPrizeFallingMoney } from "@/components/clash/CashPrizeFallingMoney";
import { CashPrizeRankButtons } from "@/components/clash/CashPrizeRankButtons";
import type { ClashSeason } from "@/lib/clashSeasons";
import { useLocale } from "@/providers/LocaleProvider";

type ClashPrizeBannerProps = {
  activeSeason: ClashSeason | null;
};

export function ClashPrizeBanner({ activeSeason }: ClashPrizeBannerProps) {
  const { t } = useLocale();

  return (
    <div className="mb-8 space-y-4">
      <div className="relative min-h-[5.5rem] overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-950 via-red-950 to-orange-950 px-4 py-4 shadow-[inset_0_1px_0_rgba(251,191,36,0.2)] sm:min-h-[6rem] sm:px-6 sm:py-5">
        <CashPrizeFallingMoney />

        <div className="relative z-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3 sm:items-center">
            <span
              aria-hidden
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-2xl ring-1 ring-amber-400/40 animate-[prize-float_3s_ease-in-out_infinite]"
            >
              💰
            </span>
            <div>
              <p className="animate-[prize-shimmer_4s_linear_infinite] bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-[length:200%_100%] bg-clip-text font-display text-lg font-black uppercase tracking-[0.12em] text-transparent sm:text-xl">
                {t.home.cashPrizeTitle}
              </p>
            </div>
          </div>
          <CashPrizeRankButtons season={activeSeason} />
        </div>
      </div>
    </div>
  );
}
