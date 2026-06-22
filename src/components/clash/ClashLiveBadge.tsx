"use client";

import { useLocale } from "@/providers/LocaleProvider";

type ClashLiveBadgeProps = {
  className?: string;
};

function AnimeFlameIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="anime-live-flame h-3.5 w-3.5 shrink-0 text-orange-500"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2c1.2 2.4 3.2 3.6 3.2 6.4a3.2 3.2 0 1 1-6.4 0c0-2.8 2-4 3.2-6.4zm0 14.4a4.8 4.8 0 0 0 4.8-4.8c0-3.6-2.8-6-4.8-8.8-2 2.8-4.8 5.2-4.8 8.8a4.8 4.8 0 0 0 4.8 4.8z" />
    </svg>
  );
}

export function ClashLiveBadge({ className = "" }: ClashLiveBadgeProps) {
  const { t } = useLocale();

  return (
    <div
      className={`anime-live-badge ${className}`.trim()}
      role="status"
      aria-live="polite"
    >
      <span className="anime-live-badge-glow" aria-hidden />
      <span className="relative flex items-center gap-2">
        <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
          <span className="anime-live-dot-ring absolute inset-0 rounded-full bg-orange-500/40" aria-hidden />
          <span className="anime-live-dot relative h-2 w-2 rounded-full bg-orange-500" aria-hidden />
        </span>
        <AnimeFlameIcon />
        <span className="anime-live-text font-display text-[10px] font-black uppercase tracking-[0.22em]">
          {t.home.clashLive}
        </span>
      </span>
    </div>
  );
}
