import type { HunterLevel } from "@/lib/points";

export type RankShieldSize = "sm" | "md" | "lg" | "xl";

export const RANK_SHIELD_SIZES: Record<RankShieldSize, number> = {
  sm: 28,
  md: 36,
  lg: 48,
  xl: 64,
};

export function getRankProgressGradient(level: HunterLevel): string {
  switch (level) {
    case 1:
      return "linear-gradient(90deg, #fb923c 0%, #fbbf24 100%)";
    case 2:
      return "linear-gradient(90deg, #f97316 0%, #38bdf8 100%)";
    case 3:
      return "linear-gradient(90deg, #a855f7 0%, #ec4899 100%)";
    case 4:
      return "linear-gradient(90deg, #f59e0b 0%, #fde047 55%, #fbbf24 100%)";
    case 5:
      return "linear-gradient(90deg, #fbbf24 0%, #f97316 35%, #22d3ee 100%)";
    default:
      return "linear-gradient(90deg, #fb923c 0%, #fbbf24 100%)";
  }
}

export function getRankProgressGlow(level: HunterLevel): string | undefined {
  if (level >= 5) return "0 0 16px rgba(34, 211, 238, 0.55), 0 0 28px rgba(251, 191, 36, 0.35)";
  if (level >= 4) return "0 0 14px rgba(251, 191, 36, 0.5)";
  if (level >= 3) return "0 0 10px rgba(168, 85, 247, 0.4)";
  return undefined;
}

export function getRankShieldAccent(level: HunterLevel): string {
  switch (level) {
    case 1:
      return "#34d399";
    case 2:
      return "#38bdf8";
    case 3:
      return "#a78bfa";
    case 4:
      return "#fbbf24";
    case 5:
      return "#f97316";
    default:
      return "#34d399";
  }
}
