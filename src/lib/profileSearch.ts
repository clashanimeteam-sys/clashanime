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

function sanitizeIlikeTerm(raw: string) {
  return raw.replace(/[%_,]/g, "").trim();
}

function dedupeSuggestions(rows: ProfileUsernameSuggestion[]) {
  const seen = new Set<string>();
  return rows.filter((row) => {
    if (seen.has(row.id)) return false;
    seen.add(row.id);
    return true;
  });
}

async function searchViaRpc(
  supabase: SupabaseClient,
  term: string,
  options?: { excludeUserId?: string; limit?: number },
): Promise<ProfileUsernameSuggestion[] | null> {
  const { data, error } = await supabase.rpc("search_profile_usernames", {
    p_query: term,
    p_exclude_user_id: options?.excludeUserId ?? null,
    p_limit: options?.limit ?? 8,
  });

  if (error) return null;
  return (data ?? []) as ProfileUsernameSuggestion[];
}

async function searchViaTable(
  supabase: SupabaseClient,
  term: string,
  options?: { excludeUserId?: string; limit?: number },
): Promise<ProfileUsernameSuggestion[]> {
  const limit = options?.limit ?? 8;
  const prefixPattern = `${term}%`;
  const containsPattern = `%${term}%`;
  const selectFields = "id, username, display_name, avatar_url, is_verified";

  let usernameQuery = supabase
    .from("profiles")
    .select(selectFields)
    .ilike("username", prefixPattern)
    .order("username", { ascending: true })
    .limit(limit);

  if (options?.excludeUserId) {
    usernameQuery = usernameQuery.neq("id", options.excludeUserId);
  }

  const { data: usernameMatches } = await usernameQuery;
  let rows = (usernameMatches ?? []) as ProfileUsernameSuggestion[];

  if (rows.length < limit) {
    let displayNameQuery = supabase
      .from("profiles")
      .select(selectFields)
      .ilike("display_name", containsPattern)
      .order("username", { ascending: true })
      .limit(limit);

    if (options?.excludeUserId) {
      displayNameQuery = displayNameQuery.neq("id", options.excludeUserId);
    }

    const { data: displayNameMatches } = await displayNameQuery;
    rows = dedupeSuggestions([...rows, ...((displayNameMatches ?? []) as ProfileUsernameSuggestion[])]);
  }

  if (rows.length === 0) {
    let containsUsernameQuery = supabase
      .from("profiles")
      .select(selectFields)
      .ilike("username", containsPattern)
      .order("username", { ascending: true })
      .limit(limit);

    if (options?.excludeUserId) {
      containsUsernameQuery = containsUsernameQuery.neq("id", options.excludeUserId);
    }

    const { data: containsMatches } = await containsUsernameQuery;
    rows = dedupeSuggestions([...rows, ...((containsMatches ?? []) as ProfileUsernameSuggestion[])]);
  }

  return rows.slice(0, limit);
}

export async function searchProfileUsernames(
  supabase: SupabaseClient | null,
  rawQuery: string,
  options?: { excludeUserId?: string; limit?: number },
): Promise<ProfileUsernameSuggestion[]> {
  if (!supabase) return [];

  const term = sanitizeIlikeTerm(normalizeUsernameQuery(rawQuery));
  if (term.length < 1) return [];

  const rpcResults = await searchViaRpc(supabase, term, options);
  if (rpcResults) return rpcResults;

  return searchViaTable(supabase, term, options);
}
