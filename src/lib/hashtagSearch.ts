import type { SupabaseClient } from "@supabase/supabase-js";

export type HashtagSuggestion = {
  tag: string;
  usage_count: number;
};

export function normalizeHashtagQuery(raw: string) {
  return raw.trim().replace(/^#+/, "").toLowerCase();
}

export async function searchHashtags(
  supabase: SupabaseClient | null,
  rawQuery: string,
  limit = 8,
): Promise<HashtagSuggestion[]> {
  if (!supabase) return [];

  const query = normalizeHashtagQuery(rawQuery);

  const { data, error } = await supabase.rpc("search_hashtags", {
    p_query: query,
    p_limit: limit,
  });

  if (error || !data) {
    return [];
  }

  return (data as HashtagSuggestion[]).filter((row) => row.tag);
}
