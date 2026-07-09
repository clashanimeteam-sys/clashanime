export const MAX_COPYRIGHT_STRIKES = 3;
export const COPYRIGHT_STRIKE_EXPIRY_DAYS = 90;

export type ChannelViolationType = "copyright" | "community" | "terms";
export type ChannelViolationContentType = "video" | "community_post";
export type ChannelViolationStatus = "active" | "expired" | "retracted";

export type ChannelViolation = {
  id: string;
  user_id: string;
  violation_type: ChannelViolationType;
  content_type: ChannelViolationContentType;
  content_id: string | null;
  content_title: string | null;
  reason: string;
  claimant_name: string | null;
  status: ChannelViolationStatus;
  staff_id: string | null;
  expires_at: string | null;
  created_at: string;
};

export function isCopyrightStrikeActive(violation: ChannelViolation) {
  if (violation.violation_type !== "copyright" || violation.status !== "active") return false;
  if (!violation.expires_at) return true;
  return new Date(violation.expires_at).getTime() > Date.now();
}

export function countActiveCopyrightStrikes(violations: ChannelViolation[]) {
  return violations.filter(isCopyrightStrikeActive).length;
}

export async function issueChannelViolation(
  supabase: { rpc: (name: string, args: Record<string, unknown>) => PromiseLike<{ error: { message: string } | null }> },
  input: {
    userId: string;
    violationType: ChannelViolationType;
    contentType: ChannelViolationContentType;
    contentId?: string | null;
    contentTitle?: string | null;
    reason?: string | null;
    claimantName?: string | null;
  },
) {
  return supabase.rpc("issue_channel_violation", {
    p_user_id: input.userId,
    p_violation_type: input.violationType,
    p_content_type: input.contentType,
    p_content_id: input.contentId ?? null,
    p_content_title: input.contentTitle ?? null,
    p_reason: input.reason ?? null,
    p_claimant_name: input.claimantName ?? null,
  });
}

export function mapRejectionToViolationType(rejectionReason?: string | null): ChannelViolationType {
  const reason = (rejectionReason ?? "").toLowerCase();
  if (reason.includes("copyright") || reason.includes("dmca") || reason.includes("rights")) {
    return "copyright";
  }
  if (reason.includes("community")) {
    return "community";
  }
  return "terms";
}
