import type { SupabaseClient } from "@supabase/supabase-js";
import { isStaff } from "@/lib/admin";
import type { Profile } from "@/lib/types";

export async function getStaffUser(supabase: SupabaseClient) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!isStaff(profile as Pick<Profile, "role"> | null)) {
    return { user: null, profile: null };
  }

  return { user, profile };
}
