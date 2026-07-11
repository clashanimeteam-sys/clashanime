import type { SupabaseClient } from "@supabase/supabase-js";

export type WatchAccessResult = {
  allowed: boolean;
  earnRequired: boolean;
};

const NEW_ACCOUNT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export async function getWatchAccess(
  supabase: SupabaseClient,
  userId: string,
): Promise<WatchAccessResult> {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("watch_onboarding_completed_at, created_at")
    .eq("id", userId)
    .maybeSingle();

  // Migration not applied yet — never block playback for logged-in members.
  if (error) {
    return { allowed: true, earnRequired: false };
  }

  if (profile?.watch_onboarding_completed_at) {
    return { allowed: true, earnRequired: false };
  }

  const createdMs = profile?.created_at ? new Date(profile.created_at).getTime() : NaN;
  const isNewAccount =
    !Number.isNaN(createdMs) && Date.now() - createdMs < NEW_ACCOUNT_WINDOW_MS;

  if (!isNewAccount) {
    return { allowed: true, earnRequired: false };
  }

  return { allowed: false, earnRequired: true };
}

/** Catalog browse on clashanime.com/watch — login only, no earn gate. */
export async function canBrowseWatchCatalog(
  supabase: SupabaseClient,
): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return Boolean(user);
}
