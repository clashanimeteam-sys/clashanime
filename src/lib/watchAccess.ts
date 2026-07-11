import type { SupabaseClient } from "@supabase/supabase-js";

export type WatchAccessResult = {
  allowed: boolean;
  earnRequired: boolean;
};

export async function getWatchAccess(
  supabase: SupabaseClient,
  userId: string,
): Promise<WatchAccessResult> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("watch_onboarding_completed_at")
    .eq("id", userId)
    .maybeSingle();

  const completed = Boolean(profile?.watch_onboarding_completed_at);
  return {
    allowed: completed,
    earnRequired: !completed,
  };
}
