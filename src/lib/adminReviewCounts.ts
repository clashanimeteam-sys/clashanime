import type { SupabaseClient } from "@supabase/supabase-js";

export type AdminNavKey =
  | "dashboard"
  | "users"
  | "videos"
  | "community"
  | "stickers"
  | "reports"
  | "moderationLog"
  | "withdrawals"
  | "kyc"
  | "seasons"
  | "legends"
  | "beatsLounge"
  | "animeTracker"
  | "blog"
  | "ads"
  | "animeNews"
  | "contact"
  | "earnMoney"
  | "emails"
  | "referrals"
  | "broadcast"
  | "settings";

export type AdminReviewCounts = {
  reviewVideos: number;
  openReports: number;
  openCommunityReports: number;
  pendingVerifications: number;
  pendingWithdrawals: number;
  pendingKyc: number;
  openContactMessages: number;
  pendingEarnMoneySubmissions: number;
  pendingBeatsTracks: number;
  pendingEmails: number;
};

export const EMPTY_ADMIN_REVIEW_COUNTS: AdminReviewCounts = {
  reviewVideos: 0,
  openReports: 0,
  openCommunityReports: 0,
  pendingVerifications: 0,
  pendingWithdrawals: 0,
  pendingKyc: 0,
  openContactMessages: 0,
  pendingEarnMoneySubmissions: 0,
  pendingBeatsTracks: 0,
  pendingEmails: 0,
};

async function countQuery(
  promise: PromiseLike<{ count: number | null; error: unknown }>,
): Promise<number> {
  const { count, error } = await promise;
  if (error) return 0;
  return count ?? 0;
}

export async function fetchAdminReviewCounts(
  supabase: SupabaseClient,
): Promise<AdminReviewCounts> {
  const [
    reviewVideos,
    openReports,
    openCommunityReports,
    pendingVerifications,
    pendingWithdrawals,
    pendingKyc,
    openContactMessages,
    pendingEarnMoneySubmissions,
    pendingBeatsTracks,
    pendingEmails,
  ] = await Promise.all([
    countQuery(
      supabase
        .from("videos")
        .select("*", { count: "exact", head: true })
        .eq("admin_review_pending", true),
    ),
    countQuery(
      supabase.from("content_reports").select("*", { count: "exact", head: true }).eq("status", "open"),
    ),
    countQuery(
      supabase
        .from("content_reports")
        .select("*", { count: "exact", head: true })
        .eq("status", "open")
        .not("post_id", "is", null),
    ),
    countQuery(
      supabase
        .from("verification_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
    ),
    countQuery(
      supabase
        .from("withdrawals")
        .select("*", { count: "exact", head: true })
        .in("status", ["pending", "reviewing", "fraud_blocked"]),
    ),
    countQuery(
      supabase
        .from("payout_kyc_submissions")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
    ),
    countQuery(
      supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "open"),
    ),
    countQuery(
      supabase
        .from("earn_money_submissions")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
    ),
    countQuery(
      supabase
        .from("anime_beats_tracks")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
    ),
    countQuery(
      supabase
        .from("transactional_emails")
        .select("*", { count: "exact", head: true })
        .in("status", ["pending", "failed"]),
    ),
  ]);

  return {
    reviewVideos,
    openReports,
    openCommunityReports,
    pendingVerifications,
    pendingWithdrawals,
    pendingKyc,
    openContactMessages,
    pendingEarnMoneySubmissions,
    pendingBeatsTracks,
    pendingEmails,
  };
}

export function totalAdminReviewCount(counts: AdminReviewCounts): number {
  return (
    counts.reviewVideos +
    counts.openReports +
    counts.pendingVerifications +
    counts.pendingWithdrawals +
    counts.pendingKyc +
    counts.openContactMessages +
    counts.pendingEarnMoneySubmissions +
    counts.pendingBeatsTracks +
    counts.pendingEmails
  );
}

export function getNavReviewCount(key: AdminNavKey, counts: AdminReviewCounts): number {
  switch (key) {
    case "dashboard":
      return totalAdminReviewCount(counts);
    case "users":
      return counts.pendingVerifications;
    case "videos":
      return counts.reviewVideos;
    case "community":
      return counts.openCommunityReports;
    case "reports":
      return counts.openReports;
    case "withdrawals":
      return counts.pendingWithdrawals;
    case "kyc":
      return counts.pendingKyc;
    case "contact":
      return counts.openContactMessages;
    case "earnMoney":
      return counts.pendingEarnMoneySubmissions;
    case "beatsLounge":
      return counts.pendingBeatsTracks;
    case "emails":
      return counts.pendingEmails;
    default:
      return 0;
  }
}

export const ADMIN_REVIEW_COUNTS_EVENT = "clashanime:admin-review-counts-changed";

export function notifyAdminReviewCountsChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ADMIN_REVIEW_COUNTS_EVENT));
}
