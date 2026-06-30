import { searchJikanAnime, type JikanAnimeSearchHit } from "@/lib/jikan";
import { createServerClient } from "@/lib/supabase/server";

export type AnimeSearchResult = JikanAnimeSearchHit & {
  clashId: string | null;
};

async function loadClashIdsByMalId(malIds: number[]): Promise<Map<number, string>> {
  const map = new Map<number, string>();
  const uniqueIds = [...new Set(malIds.filter((id) => id > 0))];
  if (uniqueIds.length === 0) return map;

  const supabase = await createServerClient();
  if (!supabase) return map;

  const { data } = await supabase
    .from("anime_releases")
    .select("mal_id, clash_id")
    .in("mal_id", uniqueIds)
    .not("clash_id", "is", null);

  for (const row of data ?? []) {
    if (typeof row.mal_id === "number" && typeof row.clash_id === "string" && row.clash_id) {
      map.set(row.mal_id, row.clash_id);
    }
  }

  return map;
}

export async function searchAnimeCatalog(query: string, limit = 8): Promise<AnimeSearchResult[]> {
  const hits = await searchJikanAnime(query, limit);
  if (hits.length === 0) return [];

  const clashByMalId = await loadClashIdsByMalId(hits.map((hit) => hit.malId));

  return hits.map((hit) => ({
    ...hit,
    clashId: clashByMalId.get(hit.malId) ?? null,
  }));
}
