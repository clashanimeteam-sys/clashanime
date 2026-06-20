import type { Dictionary } from "@/lib/i18n/dictionaries";

export type ModerationStatus = "pending" | "approved" | "rejected" | "review";

export type ScanUploadResult = {
  status: ModerationStatus;
  reason: string;
  match_video_id?: string;
};

export function getScanRejectionMessage(
  reason: string,
  moderation: Dictionary["moderation"],
): string {
  switch (reason) {
    case "duplicate_file":
      return moderation.duplicateFile;
    case "duplicate_thumbnail":
      return moderation.duplicateThumbnail;
    case "duplicate_visual":
      return moderation.duplicateVisual;
    case "missing_fingerprint":
      return moderation.missingFingerprint;
    case "auth_required":
      return moderation.authRequired;
    default:
      return moderation.rejectedGeneric;
  }
}

export function getModerationStatusLabel(
  status: ModerationStatus,
  moderation: Dictionary["moderation"],
): string {
  switch (status) {
    case "approved":
      return moderation.statusApproved;
    case "review":
      return moderation.statusReview;
    case "pending":
      return moderation.statusPending;
    case "rejected":
      return moderation.statusRejected;
  }
}
