import { buildMalIdToGuideKeyMap } from "@/lib/animeNews/heroGuideCatalogMap";
import { resolveWatchNowGuidePath } from "@/lib/animeNews/heroGuidePaths";
import { loadWatchNowCatalog } from "@/lib/animeNews/watchNow.server";
import { searchJikanAnime, type JikanAnimeSearchHit } from "@/lib/jikan";
import { createServerClient } from "@/lib/supabase/server";

export type AnimeSearchResult = JikanAnimeSearchHit & {
  clashId: string | null;
  guidePath: string;
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

  const [clashByMalId, catalog] = await Promise.all([
    loadClashIdsByMalId(hits.map((hit) => hit.malId)),
    loadWatchNowCatalog(),
  ]);
  const guideKeyByMalId = buildMalIdToGuideKeyMap(catalog);

  return hits.map((hit) => ({
    ...hit,
    clashId: clashByMalId.get(hit.malId) ?? null,
    guidePath: resolveWatchNowGuidePath(hit.malId, guideKeyByMalId.get(hit.malId) ?? null),
  }));
}
