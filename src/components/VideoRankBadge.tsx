"use client";

import { useLocale } from "@/providers/LocaleProvider";

type VideoRankBadgeProps = {
  rank: number;
  compact?: boolean;
  overlay?: boolean;
};

type MedalTier = "gold" | "silver" | "bronze" | null;

function getMedalTier(rank: number): MedalTier {
  if (rank === 1) return "gold";
  if (rank === 2) return "silver";
  if (rank === 3) return "bronze";
  return null;
}

const medalStyles: Record<
  NonNullable<MedalTier>,
  { badge: string; ring: string }
> = {
  gold: {
    badge: "bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 text-amber-950",
    ring: "ring-2 ring-amber-400/60",
  },
  silver: {
    badge: "bg-gradient-to-br from-slate-200 via-slate-300 to-slate-500 text-slate-900",
    ring: "ring-2 ring-slate-300/60",
  },
  bronze: {
    badge: "bg-gradient-to-br from-orange-300 via-amber-600 to-orange-800 text-orange-950",
    ring: "ring-2 ring-orange-400/50",
  },
};

export function VideoRankBadge({ rank, compact = false, overlay = false }: VideoRankBadgeProps) {
  const { t } = useLocale();
  const medal = getMedalTier(rank);
  const positionClass = overlay
    ? compact
      ? "start-3 top-3"
      : "start-4 top-4"
    : compact
      ? "start-2 top-2"
      : "start-3 top-3";

  if (medal) {
    const style = medalStyles[medal];
    const medalLabel =
      medal === "gold"
        ? t.video.goldMedal
        : medal === "silver"
          ? t.video.silverMedal
          : t.video.bronzeMedal;

    return (
      <span
        className={`absolute ${positionClass} z-20 inline-flex items-center gap-0.5 rounded-full font-bold shadow-lg ${compact ? "px-1.5 py-0.5 text-[9px]" : overlay ? "gap-1.5 px-3 py-1.5 text-sm" : "gap-1 px-2.5 py-1 text-xs"} ${style.badge} ${style.ring}`}
        aria-label={`${medalLabel}, ${t.video.rank} ${rank}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={compact ? "h-2.5 w-2.5" : overlay ? "h-4 w-4" : "h-3.5 w-3.5"}
          aria-hidden
        >
          <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.8 7.2 17l.9-5.4L4.2 7.7l5.4-.8L12 2z" />
        </svg>
        #{rank}
      </span>
    );
  }

  return (
    <span
      className={`absolute ${positionClass} z-20 inline-flex items-center rounded-full bg-black/80 font-bold text-white shadow-lg backdrop-blur-sm ${compact ? "px-1.5 py-0.5 text-[9px]" : overlay ? "px-3 py-1.5 text-sm" : "px-2 py-0.5 text-xs"}`}
    >
      #{rank}
    </span>
  );
}
