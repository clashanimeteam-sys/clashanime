"use client";

import { useLocale } from "@/providers/LocaleProvider";

export function ClashLiveBadge() {
  const { t } = useLocale();

  return (
    <div className="absolute start-0 top-0 z-20">
      <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-orange-700 shadow-sm backdrop-blur-sm dark:text-orange-300">
        <span
          className="h-2 w-2 shrink-0 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.9)]"
          aria-hidden
        />
        {t.home.clashLive}
      </div>
    </div>
  );
}
