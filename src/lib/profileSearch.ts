import type { SupabaseClient } from "@supabase/supabase-js";

export type ProfileUsernameSuggestion = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  is_verified?: boolean;
};

export function normalizeUsernameQuery(raw: string) {
  return raw.trim().replace(/^@+/, "");
}

export async function searchProfileUsernames(
  supabase: SupabaseClient | null,
  rawQuery: string,
  options?: { excludeUserId?: string; limit?: number },
): Promise<ProfileUsernameSuggestion[]> {
  if (!supabase) return [];

  const query = normalizeUsernameQuery(rawQuery);
  if (query.length < 1) return [];

  const limit = options?.limit ?? 8;
  const pattern = `${query.replace(/[%_,]/g, "")}%`;

  let request = supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, is_verified, is_banned")
    .or(`username.ilike.${pattern},display_name.ilike.${pattern}`)
    .order("username", { ascending: true })
    .limit(limit);

  if (options?.excludeUserId) {
    request = request.neq("id", options.excludeUserId);
  }

  const { data, error } = await request;
  if (error || !data) return [];

  return data
    .filter((row) => !row.is_banned)
    .map(({ id, username, display_name, avatar_url, is_verified }) => ({
      id,
      username,
      display_name,
      avatar_url,
      is_verified,
    }));
}
