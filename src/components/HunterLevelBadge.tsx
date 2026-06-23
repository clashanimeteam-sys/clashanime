"use client";

import { RankLetter } from "@/components/RankLetter";
import { getLevelDefinition, pointsToLevel } from "@/lib/points";
import { useLocale } from "@/providers/LocaleProvider";

type HunterLevelBadgeProps = {
  level?: number | null;
  points?: number | null;
  size?: "sm" | "md" | "lg";
};

export function HunterLevelBadge({ level, points, size = "md" }: HunterLevelBadgeProps) {
  const { t, formatNumber } = useLocale();
  const resolvedLevel = points != null ? pointsToLevel(points) : (level ?? 1);
  const definition = getLevelDefinition(resolvedLevel);

  return (
    <RankLetter
      rank={definition.rank}
      size={size}
      title={`${formatNumber(points ?? 0)} ${t.points.pointsLabel}`}
    />
  );
}
