import { fetchJikanAnimeDetail } from "@/lib/jikan";
import type { FeaturedAnimeEntry } from "@/lib/animeNews/featuredAnimeCatalog";
import {
  buildFeaturedAnimeCatalogSeed,
  type FeaturedAnimeCatalogSeed,
} from "@/lib/animeNews/featuredAnimeCatalog";

const JIKAN_API = "https://api.jikan.moe/v4";
const FETCH_DELAY_MS = 320;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function seedToEntry(seed: FeaturedAnimeCatalogSeed): FeaturedAnimeEntry {
  return {
    key: seed.key,
    title: seed.title,
    category: seed.category,
    priority: seed.priority,
    malId: seed.malId,
    posterUrl: null,
    synopsis: null,
    youtubeId: null,
    malUrl: seed.malId ? `https://myanimelist.net/anime/${seed.malId}` : null,
  };
}

export function parseFeaturedAnimeCatalog(raw: unknown): FeaturedAnimeEntry[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item): FeaturedAnimeEntry | null => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const key = typeof row.key === "string" ? row.key : "";
      const title = typeof row.title === "string" ? row.title : "";
      if (!key || !title) return null;

      const category = row.category;
      const validCategory =
        category === "legends" ||
        category === "action" ||
        category === "mystery" ||
        category === "isekai" ||
        category === "sports" ||
        category === "romance" ||
        category === "classics"
          ? category
          : "legends";

      return {
        key,
        title,
        category: validCategory,
        priority: typeof row.priority === "number" ? row.priority : 999,
        malId: typeof row.malId === "number" ? row.malId : null,
        posterUrl: typeof row.posterUrl === "string" ? row.posterUrl : null,
        synopsis: typeof row.synopsis === "string" ? row.synopsis : null,
        youtubeId: typeof row.youtubeId === "string" ? row.youtubeId : null,
        malUrl: typeof row.malUrl === "string" ? row.malUrl : null,
      };
    })
    .filter((item): item is FeaturedAnimeEntry => item !== null)
    .sort((a, b) => a.priority - b.priority);
}

export async function enrichFeaturedAnimeCatalog(
  seeds: FeaturedAnimeCatalogSeed[] = buildFeaturedAnimeCatalogSeed(),
): Promise<FeaturedAnimeEntry[]> {
  const enriched: FeaturedAnimeEntry[] = [];

  for (const seed of seeds) {
    let entry = seedToEntry(seed);

    if (seed.malId) {
      const detail = await fetchJikanAnimeDetail(seed.malId);
      if (detail) {
        entry = {
          ...entry,
          title: detail.titleEnglish ?? detail.title ?? entry.title,
          posterUrl: detail.posterUrl,
          synopsis: detail.synopsis,
          youtubeId: detail.youtubeId,
          malUrl: detail.malUrl,
        };
      }
      await sleep(FETCH_DELAY_MS);
    }

    enriched.push(entry);
  }

  return enriched;
}

export async function getFeaturedAnimeCatalog(stored: FeaturedAnimeEntry[] = []): Promise<FeaturedAnimeEntry[]> {
  const parsed = stored.length > 0 ? stored : [];
  const enrichedCount = parsed.filter((entry) => entry.posterUrl && entry.synopsis).length;

  if (enrichedCount >= 40) return parsed;

  return enrichFeaturedAnimeCatalog();
}

export async function searchJikanMalId(title: string): Promise<number | null> {
  const response = await fetch(`${JIKAN_API}/anime?q=${encodeURIComponent(title)}&limit=1`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 86400 },
  });

  if (!response.ok) return null;
  const payload = (await response.json()) as { data?: Array<{ mal_id?: number }> };
  return payload.data?.[0]?.mal_id ?? null;
}
