import {
  FEATURED_ANIME_CATALOG_SEED,
  type FeaturedAnimeEntry,
} from "@/lib/animeNews/featuredAnimeCatalog";

export function buildMalIdToGuideKeyMap(entries: FeaturedAnimeEntry[] = []): Map<number, string> {
  const map = new Map<number, string>();

  for (const seed of FEATURED_ANIME_CATALOG_SEED) {
    if (seed.malId) {
      map.set(seed.malId, seed.key);
    }
  }

  for (const entry of entries) {
    if (entry.malId) {
      map.set(entry.malId, entry.key);
    }
  }

  return map;
}
