"use client";

import { useLocale } from "@/providers/LocaleProvider";

export function ClashLiveBadge() {
  const { t } = useLocale();

  return (
    <div className="inline-flex items-center gap-2 rounded-none rounded-br-2xl border border-orange-500/30 border-s-0 border-t-0 bg-orange-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-orange-700 shadow-sm backdrop-blur-sm dark:text-orange-300">
      <span
        className="h-2 w-2 shrink-0 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.9)]"
        aria-hidden
      />
      {t.home.clashLive}
    </div>
  );
}
