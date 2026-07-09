"use client";

import { HunterRankShield } from "@/components/hunter/HunterRankShield";
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
  const title = `${rankName} · ${formatNumber(points ?? 0)} ${t.points.pointsLabel}`;

  if (showName) {
    return (
      <span className="inline-flex items-center gap-2">
        <HunterRankShield level={definition.level} size={size} title={title} highlighted />
        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">{rankName}</span>
      </span>
    );
  }

  return <HunterRankShield level={definition.level} size={size} title={title} highlighted />;
}
