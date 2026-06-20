"use client";

import { getLevelDefinition, LEVEL_STYLES } from "@/lib/points";
import { useLocale } from "@/providers/LocaleProvider";

type HunterLevelBadgeProps = {
  level?: number | null;
  points?: number | null;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
};

const sizeClasses = {
  sm: "h-7 min-w-7 px-1.5 text-[10px]",
  md: "h-9 min-w-9 px-2 text-xs",
  lg: "h-11 min-w-11 px-2.5 text-sm",
};

export function HunterLevelBadge({
  level,
  points,
  size = "md",
  showLabel = true,
}: HunterLevelBadgeProps) {
  const { t } = useLocale();
  const resolvedLevel = level ?? 1;
  const definition = getLevelDefinition(resolvedLevel);
  const style = LEVEL_STYLES[definition.rank];
  const levelName = t.points.levels[definition.key];

  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={`inline-flex items-center justify-center rounded-md border font-black tracking-wider ${sizeClasses[size]} ${style.badge} ${style.glow} ring-1 ${style.ring}`}
        aria-label={`${levelName}, ${t.points.rank} ${definition.rank}`}
        title={`${levelName} · ${(points ?? 0).toLocaleString()} ${t.points.pointsLabel}`}
      >
        {definition.rank}
      </span>
      {showLabel ? (
        <div className="min-w-0">
          <p className="truncate text-xs font-bold uppercase tracking-[0.18em] text-zinc-300">
            {levelName}
          </p>
          <p className="text-[11px] text-zinc-500">
            {t.points.rank} {definition.rank}
          </p>
        </div>
      ) : null}
    </div>
  );
}
