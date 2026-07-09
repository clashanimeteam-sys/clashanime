import type { Profile } from "@/lib/types";

export const POINT_VALUES = {
  signupWelcome: 25,
  referralClick: 10,
  referralSignup: 100,
  referralWelcome: 50,
  referralFirstVideo: 200,
  referralFirstBattle: 150,
  videoUpload: 20,
  trendingBonus: 500,
  communityPost: 5,
} as const;

export type HunterLevel = 1 | 2 | 3 | 4 | 5;

export type LevelKey = "newbie" | "explorer" | "duelist" | "master" | "clashMaster";

export type LevelDefinition = {
  level: HunterLevel;
  key: LevelKey;
  shortLabel: "N" | "EX" | "D" | "M" | "CM";
  minPoints: number;
  maxPoints: number | null;
};

export const LEVELS: LevelDefinition[] = [
  { level: 1, key: "newbie", shortLabel: "N", minPoints: 0, maxPoints: 999 },
  { level: 2, key: "explorer", shortLabel: "EX", minPoints: 1000, maxPoints: 2999 },
  { level: 3, key: "duelist", shortLabel: "D", minPoints: 3000, maxPoints: 5999 },
  { level: 4, key: "master", shortLabel: "M", minPoints: 6000, maxPoints: 9999 },
  { level: 5, key: "clashMaster", shortLabel: "CM", minPoints: 10000, maxPoints: 20000 },
];

export const CLASH_MASTER_LEVEL: HunterLevel = 5;
export const CLASH_MASTER_MIN_POINTS = 10000;
export const CLASH_MASTER_MAX_POINTS = 20000;

export const BOUNTY_REWARD_KEYS = [
  "voteComment",
  "upload",
  "doubleVote",
  "master",
  "clashMaster",
] as const;

export type BountyRewardKey = (typeof BOUNTY_REWARD_KEYS)[number];

export function getUnlockedBountyRewards(level: number): BountyRewardKey[] {
  const rewards: BountyRewardKey[] = ["voteComment"];
  if (level >= 2) rewards.push("upload");
  if (level >= 3) rewards.push("doubleVote");
  if (level >= 4) rewards.push("master");
  if (level >= 5) rewards.push("clashMaster");
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
      return ["voteComment", "upload", "doubleVote", "master"];
    case 5:
      return ["voteComment", "upload", "doubleVote", "master", "clashMaster"];
    default:
      return ["voteComment"];
  }
}

export function pointsToLevel(points: number): HunterLevel {
  if (points >= CLASH_MASTER_MIN_POINTS) return 5;
  if (points >= 6000) return 4;
  if (points >= 3000) return 3;
  if (points >= 1000) return 2;
  return 1;
}

export function getLevelDefinition(level: number): LevelDefinition {
  return LEVELS.find((entry) => entry.level === level) ?? LEVELS[0];
}

export function getLevelLabel(
  level: number,
  labels: Record<LevelKey, string>,
): string {
  return labels[getLevelDefinition(level).key];
}

export function getLevelProgress(points: number) {
  const level = pointsToLevel(points);
  const current = getLevelDefinition(level);
  const next = LEVELS.find((entry) => entry.level === level + 1) ?? null;
  const rankMin = current.minPoints;
  const rankMax = next ? next.minPoints - 1 : current.maxPoints ?? points;
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
    nextLevelKey: next?.key ?? null,
  };
}

export function canUploadVideos(profile: Pick<Profile, "level" | "points"> | null | undefined) {
  return Boolean(profile);
}

export function canPostToCommunity(profile: Pick<Profile, "level" | "points"> | null | undefined) {
  if (!profile) return false;
  return (profile.level ?? pointsToLevel(profile.points ?? 0)) >= 2;
}

export function canRequestVerification(profile: Pick<Profile, "level" | "points" | "is_verified"> | null | undefined) {
  if (!profile || profile.is_verified) return false;
  return (profile.level ?? pointsToLevel(profile.points ?? 0)) >= CLASH_MASTER_LEVEL;
}

export function getReferralUrl(username: string) {
  return `https://www.clashanime.com/ref/${encodeURIComponent(username)}`;
}

export const REFERRAL_COOKIE = "clash_ref";

export const LEVEL_STYLES: Record<
  LevelDefinition["shortLabel"],
  { badge: string; glow: string; ring: string }
> = {
  N: {
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-400/40",
    glow: "shadow-[0_0_18px_rgba(16,185,129,0.35)]",
    ring: "ring-emerald-400/30",
  },
  EX: {
    badge: "bg-sky-500/15 text-sky-300 border-sky-400/40",
    glow: "shadow-[0_0_18px_rgba(56,189,248,0.35)]",
    ring: "ring-sky-400/30",
  },
  D: {
    badge: "bg-violet-500/15 text-violet-300 border-violet-400/40",
    glow: "shadow-[0_0_18px_rgba(167,139,250,0.4)]",
    ring: "ring-violet-400/30",
  },
  M: {
    badge: "bg-amber-400/15 text-amber-200 border-amber-300/50",
    glow: "shadow-[0_0_22px_rgba(251,191,36,0.4)]",
    ring: "ring-amber-300/40",
  },
  CM: {
    badge: "bg-orange-500/15 text-orange-200 border-orange-300/50",
    glow: "shadow-[0_0_24px_rgba(249,115,22,0.45)]",
    ring: "ring-orange-300/40",
  },
};
