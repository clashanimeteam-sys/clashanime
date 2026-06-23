import type { SupabaseClient } from "@supabase/supabase-js";
import { normalizeHashtagSlug } from "@/lib/hashtagUrls";

export type HashtagSuggestion = {
  tag: string;
  usage_count: number;
};

export function normalizeHashtagQuery(raw: string) {
  return normalizeHashtagSlug(raw);
}

export async function searchHashtags(
  supabase: SupabaseClient | null,
  rawQuery: string,
  limit = 8,
): Promise<HashtagSuggestion[]> {
  if (!supabase) return [];

  const query = normalizeHashtagSlug(rawQuery);

  const { data, error } = await supabase.rpc("search_hashtags", {
    p_query: query,
    p_limit: limit,
  });

  if (error || !data) {
    return [];
  }

  return (data as HashtagSuggestion[]).filter((row) => row.tag);
}
