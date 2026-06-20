import type { SupabaseClient } from "@supabase/supabase-js";
import type { ModerationStatus } from "@/lib/moderation";

export type ModerationActionType =
  | "approve"
  | "reject"
  | "review"
  | "delete"
  | "verify_channel"
  | "unverify_channel"
  | "ban_user"
  | "unban_user";

export type LogModerationActionInput = {
  videoId?: string | null;
  targetUserId?: string | null;
  staffId: string;
  action: ModerationActionType;
  previousStatus?: ModerationStatus | string | null;
  newStatus?: ModerationStatus | string | null;
  notes?: string | null;
  metadata?: Record<string, unknown>;
};

export async function logModerationAction(
  supabase: SupabaseClient,
  input: LogModerationActionInput,
): Promise<boolean> {
  const { error } = await supabase.from("moderation_actions").insert({
    video_id: input.videoId ?? null,
    target_user_id: input.targetUserId ?? null,
    staff_id: input.staffId,
    action: input.action,
    previous_status: input.previousStatus ?? null,
    new_status: input.newStatus ?? null,
    notes: input.notes ?? null,
    metadata: input.metadata ?? {},
  });

  return !error;
}

export function moderationActionFromStatus(status: ModerationStatus): ModerationActionType {
  if (status === "approved") return "approve";
  if (status === "rejected") return "reject";
  return "review";
}
