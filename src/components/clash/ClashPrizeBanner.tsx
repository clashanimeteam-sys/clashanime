"use client";

import Link from "next/link";
import { useLocale } from "@/providers/LocaleProvider";

export function ClashPrizeBanner() {
  const { t } = useLocale();

  return (
    <div className="mb-8 space-y-4">
      <div className="overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-950 via-red-950 to-orange-950 px-4 py-4 shadow-[inset_0_1px_0_rgba(251,191,36,0.2)] sm:px-6 sm:py-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
              <p className="mt-1 text-sm text-amber-100/85">{t.home.cashPrizeSubtitle}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[t.home.cashPrizeRank1, t.home.cashPrizeRank2, t.home.cashPrizeRank3].map((label) => (
              <span
                key={label}
                className="rounded-full border border-amber-400/25 bg-black/25 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-200"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-orange-400/25 bg-gradient-to-r from-zinc-950 via-orange-950 to-amber-950 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3 sm:items-center">
            <span
              aria-hidden
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-orange-400 to-red-500 text-lg font-black text-amber-950 shadow-[0_0_24px_rgba(251,191,36,0.35)]"
            >
              CC
            </span>
            <div>
              <p className="font-display text-lg font-black uppercase tracking-[0.1em] text-amber-200 sm:text-xl">
                {t.home.clashCoinsTitle}
              </p>
              <p className="mt-1 text-sm text-orange-100/85">{t.home.clashCoinsSubtitle}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-amber-400/20 bg-black/20 px-3 py-1 text-[11px] font-semibold text-amber-100">
                  {t.home.clashCoinsExchange}
                </span>
                <span className="rounded-full border border-orange-400/20 bg-black/20 px-3 py-1 text-[11px] font-semibold text-orange-100">
                  {t.home.clashCoinsMinPayout}
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/profile#wallet"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-bold text-amber-950 shadow-[0_12px_30px_rgba(249,115,22,0.25)] transition-transform hover:-translate-y-0.5"
          >
            {t.home.clashCoinsOpenWallet}
          </Link>
        </div>
      </div>
    </div>
  );
}
