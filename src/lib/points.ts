import type { Profile } from "@/lib/types";

export const POINT_VALUES = {
  referralClick: 10,
  referralSignup: 100,
  videoLike: 5,
  videoUpload: 20,
  trendingBonus: 500,
  communityPost: 50,
} as const;

export type HunterLevel = 1 | 2 | 3 | 4;

export type LevelDefinition = {
  level: HunterLevel;
  key: "rookie" | "challenger" | "elite" | "legend";
  rank: "E" | "C" | "A" | "S";
  minPoints: number;
  maxPoints: number | null;
};

export const LEVELS: LevelDefinition[] = [
  { level: 1, key: "rookie", rank: "E", minPoints: 0, maxPoints: 500 },
  { level: 2, key: "challenger", rank: "C", minPoints: 501, maxPoints: 2000 },
  { level: 3, key: "elite", rank: "A", minPoints: 2001, maxPoints: 5000 },
  { level: 4, key: "legend", rank: "S", minPoints: 5001, maxPoints: null },
];

export const BOUNTY_REWARD_KEYS = ["voteComment", "upload", "doubleVote", "legend"] as const;

export type BountyRewardKey = (typeof BOUNTY_REWARD_KEYS)[number];

export function getUnlockedBountyRewards(level: number): BountyRewardKey[] {
  const rewards: BountyRewardKey[] = ["voteComment"];
  if (level >= 2) rewards.push("upload");
  if (level >= 3) rewards.push("doubleVote");
  if (level >= 4) rewards.push("legend");
  return rewards;
}

export function getBountiesForLevel(level: HunterLevel): BountyRewardKey[] {
  switch (level) {
    case 1:
      return ["voteComment"];
    case 2:
      return ["voteComment", "upload"];
    case 3:
      return ["voteComment", "upload", "doubleVote"];
    case 4:
      return ["voteComment", "upload", "doubleVote", "legend"];
    default:
      return ["voteComment"];
  }
}

export function pointsToLevel(points: number): HunterLevel {
  if (points >= 5001) return 4;
  if (points >= 2001) return 3;
  if (points >= 501) return 2;
  return 1;
}

export function getLevelDefinition(level: number): LevelDefinition {
  return LEVELS.find((entry) => entry.level === level) ?? LEVELS[0];
}

export function getLevelProgress(points: number) {
  const level = pointsToLevel(points);
  const current = getLevelDefinition(level);
  const next = LEVELS.find((entry) => entry.level === level + 1) ?? null;
  const rankMin = current.minPoints;
  const rankMax = next ? next.minPoints - 1 : points;
  const rankSpan = Math.max(rankMax - rankMin + 1, 1);
  const pointsInRank = Math.min(Math.max(points - rankMin + 1, 0), rankSpan);
  const tierProgress = next ? Math.min(100, Math.round((pointsInRank / rankSpan) * 100)) : 100;

  return {
    level,
    current,
    next,
    progress: tierProgress,
    tierProgress,
    pointsInRank,
    rankMin,
    rankMax,
    rankSpan,
    pointsToNext: next ? Math.max(next.minPoints - points, 0) : 0,
    nextRank: next?.rank ?? null,
    nextLevelKey: next?.key ?? null,
  };
}

export function canUploadVideos(profile: Pick<Profile, "level" | "points"> | null | undefined) {
  if (!profile) return false;
  return (profile.level ?? pointsToLevel(profile.points ?? 0)) >= 2;
}

export function canPostToCommunity(profile: Pick<Profile, "level" | "points"> | null | undefined) {
  if (!profile) return false;
  return (profile.level ?? pointsToLevel(profile.points ?? 0)) >= 3;
}

export function getReferralUrl(username: string) {
  return `https://www.clashanime.com/ref/${encodeURIComponent(username)}`;
}

export const REFERRAL_COOKIE = "clash_ref";

export const LEVEL_STYLES: Record<
  LevelDefinition["rank"],
  { badge: string; glow: string; ring: string }
> = {
  E: {
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-400/40",
    glow: "shadow-[0_0_18px_rgba(16,185,129,0.35)]",
    ring: "ring-emerald-400/30",
  },
  C: {
    badge: "bg-sky-500/15 text-sky-300 border-sky-400/40",
    glow: "shadow-[0_0_18px_rgba(56,189,248,0.35)]",
    ring: "ring-sky-400/30",
  },
  A: {
    badge: "bg-violet-500/15 text-violet-300 border-violet-400/40",
    glow: "shadow-[0_0_18px_rgba(167,139,250,0.4)]",
    ring: "ring-violet-400/30",
  },
  S: {
    badge: "bg-amber-400/15 text-amber-200 border-amber-300/50",
    glow: "shadow-[0_0_24px_rgba(251,191,36,0.45)]",
    ring: "ring-amber-300/40",
  },
};
