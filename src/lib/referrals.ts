import type { Locale } from "@/lib/types";

export const REFERRAL_POINT_VALUES = {
  click: 10,
  signupReferrer: 100,
  signupInvitee: 50,
  firstVideo: 200,
  firstBattle: 150,
} as const;

export type ReferralTier = 0 | 1 | 2 | 3;

export type ReferralTierDefinition = {
  tier: ReferralTier;
  key: "none" | "scout" | "recruit" | "leader";
  minSignups: number;
  nameColorClass: string;
  avatarFrameClass: string;
};

export const REFERRAL_TIERS: ReferralTierDefinition[] = [
  {
    tier: 0,
    key: "none",
    minSignups: 0,
    nameColorClass: "",
    avatarFrameClass: "",
  },
  {
    tier: 1,
    key: "scout",
    minSignups: 5,
    nameColorClass: "text-emerald-500 dark:text-emerald-400",
    avatarFrameClass: "ring-2 ring-emerald-400/60",
  },
  {
    tier: 2,
    key: "recruit",
    minSignups: 20,
    nameColorClass: "text-sky-500 dark:text-sky-400",
    avatarFrameClass: "ring-2 ring-sky-400/70 shadow-[0_0_16px_rgba(56,189,248,0.35)]",
  },
  {
    tier: 3,
    key: "leader",
    minSignups: 50,
    nameColorClass: "text-amber-500 dark:text-amber-300",
    avatarFrameClass: "ring-[3px] ring-amber-300/80 shadow-[0_0_20px_rgba(251,191,36,0.45)]",
  },
];

export type ReferralStats = {
  signup_count: number;
  week_signups: number;
  referral_tier: number;
  next_tier_at: number;
  engagement_first_video: number;
  engagement_first_battle: number;
};

export type ReferralLeaderboardRow = {
  rank: number;
  user_id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  referral_tier: number;
  signup_count: number;
};

export type ReferralFlashEvent = {
  multiplier: number;
  event_id: string;
  title_en: string;
  title_ar: string;
  title_ja: string;
};

export function getReferralTierDefinition(tier: number): ReferralTierDefinition {
  return REFERRAL_TIERS.find((entry) => entry.tier === tier) ?? REFERRAL_TIERS[0];
}

export function getReferralTierProgress(signupCount: number, currentTier: number) {
  const nextTierDef = REFERRAL_TIERS.find((entry) => entry.tier === currentTier + 1) ?? null;
  if (!nextTierDef) {
    return { progress: 100, current: signupCount, target: signupCount, nextTier: null };
  }

  const currentMin = getReferralTierDefinition(currentTier).minSignups;
  const span = Math.max(nextTierDef.minSignups - currentMin, 1);
  const progress = Math.min(100, Math.round(((signupCount - currentMin) / span) * 100));

  return {
    progress: Math.max(progress, 0),
    current: signupCount,
    target: nextTierDef.minSignups,
    nextTier: nextTierDef,
  };
}

export function getFlashEventTitle(event: ReferralFlashEvent | null, locale: Locale): string | null {
  if (!event) return null;
  if (locale === "ar") return event.title_ar;
  if (locale === "ja") return event.title_ja;
  return event.title_en;
}

export function getReferralNameClass(referralTier?: number | null): string {
  return getReferralTierDefinition(referralTier ?? 0).nameColorClass;
}

export function getReferralAvatarFrameClass(referralTier?: number | null): string {
  return getReferralTierDefinition(referralTier ?? 0).avatarFrameClass;
}
