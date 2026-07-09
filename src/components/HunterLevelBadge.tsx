"use client";

import { RankLetter } from "@/components/RankLetter";
import { getLevelDefinition, getLevelLabel, pointsToLevel } from "@/lib/points";
import { useLocale } from "@/providers/LocaleProvider";

type HunterLevelBadgeProps = {
  level?: number | null;
  points?: number | null;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
};

export function HunterLevelBadge({
  level,
  points,
  size = "md",
  showName = false,
}: HunterLevelBadgeProps) {
  const { t, formatNumber } = useLocale();
  const resolvedLevel = points != null ? pointsToLevel(points) : (level ?? 1);
  const definition = getLevelDefinition(resolvedLevel);
  const rankName = getLevelLabel(resolvedLevel, t.points.levels);

  if (showName) {
    return (
      <span className="inline-flex items-center gap-2">
        <RankLetter
          rank={definition.shortLabel}
          size={size}
          title={`${rankName} · ${formatNumber(points ?? 0)} ${t.points.pointsLabel}`}
        />
        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">{rankName}</span>
      </span>
    );
  }

  return (
    <RankLetter
      rank={definition.shortLabel}
      size={size}
      title={`${rankName} · ${formatNumber(points ?? 0)} ${t.points.pointsLabel}`}
    />
  );
}
