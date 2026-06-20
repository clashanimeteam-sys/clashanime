import type { SupabaseClient } from "@supabase/supabase-js";

export async function submitContentReport(
  supabase: SupabaseClient,
  videoId: string,
  reporterId: string,
  reason = "copyright",
): Promise<boolean> {
  const { error } = await supabase.from("content_reports").insert({
    video_id: videoId,
    reporter_id: reporterId,
    reason,
  });

  return !error;
}
