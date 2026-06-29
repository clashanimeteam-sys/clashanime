"use client";

import { useLocale } from "@/providers/LocaleProvider";

export function ClashLiveBadge({ compact = false }: { compact?: boolean }) {
  const { t } = useLocale();

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-none rounded-br-xl border border-orange-500/30 border-s-0 border-t-0 bg-orange-500/10 font-bold uppercase tracking-[0.16em] text-orange-700 shadow-sm backdrop-blur-sm dark:text-orange-300 ${
        compact ? "px-2 py-0.5 text-[9px] tracking-[0.12em]" : "px-3 py-1.5 text-xs tracking-[0.2em]"
      }`}
    >
      <span
        className={`shrink-0 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.9)] ${
          compact ? "h-1.5 w-1.5" : "h-2 w-2"
        }`}
        aria-hidden
      />
      {t.home.clashLive}
    </div>
  );
}
