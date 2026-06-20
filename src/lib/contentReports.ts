import type { SupabaseClient } from "@supabase/supabase-js";
import type { CommunityReportReason } from "@/lib/reportReasons";
import { parseVideoId, type ReportReason } from "@/lib/reportReasons";

export type SubmitContentReportInput = {
  videoId?: string;
  postId?: string;
  reporterId: string;
  reason?: ReportReason | CommunityReportReason;
  originalSourceUrl?: string | null;
  details?: string | null;
};

function buildReportDetails(input: SubmitContentReportInput): string | null {
  const parts: string[] = [];

  if (input.originalSourceUrl?.trim()) {
    parts.push(`Original source: ${input.originalSourceUrl.trim()}`);
  }

  if (input.details?.trim()) {
    parts.push(input.details.trim());
  }

  return parts.length > 0 ? parts.join("\n") : null;
}

export async function submitContentReport(
  supabase: SupabaseClient,
  videoIdOrInput: string | SubmitContentReportInput,
  reporterId?: string,
  reason: ReportReason = "copyright",
): Promise<boolean> {
  const input: SubmitContentReportInput =
    typeof videoIdOrInput === "string"
      ? { videoId: videoIdOrInput, reporterId: reporterId ?? "", reason }
      : videoIdOrInput;

  if (input.postId != null) {
    const { error } = await supabase.from("content_reports").insert({
      post_id: input.postId,
      reporter_id: input.reporterId,
      reason: input.reason ?? "off_topic",
      details: buildReportDetails(input),
    });
    return !error;
  }

  const { error } = await supabase.from("content_reports").insert({
    video_id: parseVideoId(input.videoId ?? ""),
    reporter_id: input.reporterId,
    reason: input.reason ?? "copyright",
    details: buildReportDetails(input),
  });

  return !error;
}

export async function submitCommunityPostReport(
  supabase: SupabaseClient,
  input: {
    postId: string;
    reporterId: string;
    reason: CommunityReportReason;
    details?: string | null;
  },
): Promise<boolean> {
  return submitContentReport(supabase, {
    postId: input.postId,
    reporterId: input.reporterId,
    reason: input.reason,
    details: input.details ?? null,
  });
}
