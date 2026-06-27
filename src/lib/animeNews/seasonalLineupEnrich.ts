import { fetchJikanAnimeDetail } from "@/lib/jikan";
import type { SeasonalLineupEntry } from "@/lib/animeNews/seasonalLineupTypes";
import { buildSummer2026SeasonalLineup } from "@/lib/animeNews/summer2026Lineup";

const JIKAN_API = "https://api.jikan.moe/v4";
const FETCH_DELAY_MS = 400;

type JikanSeasonRow = {
  mal_id: number;
  url?: string;
  title?: string;
  title_english?: string | null;
  title_japanese?: string | null;
  synopsis?: string | null;
  images?: {
    jpg?: { large_image_url?: string | null; image_url?: string | null };
  };
};

const CONTINUING_MAL_IDS: Record<string, number> = {
  "Ascendance of a Bookworm: Adopted Daughter of an Archduke": 54234,
  "Case Closed (Detective Conan)": 235,
  "Daemons of the Shadow Realm": 58754,
  "Digimon Beatbreak": 59159,
  "Liar Game": 339,
  "One Piece – Elbaph Arc Part 2": 21,
  "RILAKKUMA": 49839,
  "Star Detective Precure!": 58449,
  "That Time I Got Reincarnated as a Slime Season 4": 55809,
  "The Classroom of a Black Cat and a Witch": 57753,
  "The Drops of God": 51265,
  "Welcome to Demon School! Iruma-kun Season 4": 59027,
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeTitle(value: string): string {
  return value
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\bseason\b/g, "s")
    .replace(/\bpart\b/g, "p")
    .replace(/\s+/g, " ")
    .trim();
}

function titlesMatch(a: string, b: string): boolean {
  const left = normalizeTitle(a);
  const right = normalizeTitle(b);
  if (!left || !right) return false;
  if (left === right) return true;
  if (left.includes(right) || right.includes(left)) return true;

  const leftTokens = new Set(left.split(" ").filter((token) => token.length > 2));
  const rightTokens = right.split(" ").filter((token) => token.length > 2);
  if (rightTokens.length === 0) return false;
  const overlap = rightTokens.filter((token) => leftTokens.has(token)).length;
  return overlap / rightTokens.length >= 0.6;
}

function posterFromRow(row: JikanSeasonRow): string | null {
  return row.images?.jpg?.large_image_url ?? row.images?.jpg?.image_url ?? null;
}

async function fetchJikanSummer2026Catalog(): Promise<JikanSeasonRow[]> {
  const rows: JikanSeasonRow[] = [];
  let page = 1;
  let hasNext = true;

  while (hasNext && page <= 8) {
    const response = await fetch(`${JIKAN_API}/seasons/2026/summer?page=${page}&limit=25`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
    });

    if (response.status === 429) {
      await sleep(1200);
      continue;
    }

    if (!response.ok) break;

    const payload = (await response.json()) as {
      data?: JikanSeasonRow[];
      pagination?: { has_next_page?: boolean };
    };

    rows.push(...(payload.data ?? []));
    hasNext = Boolean(payload.pagination?.has_next_page);
    page += 1;
    if (hasNext) await sleep(FETCH_DELAY_MS);
  }

  return rows;
}

function matchCatalogRow(title: string, catalog: JikanSeasonRow[]): JikanSeasonRow | null {
  for (const row of catalog) {
    const candidates = [row.title_english, row.title, row.title_japanese].filter(Boolean) as string[];
    if (candidates.some((candidate) => titlesMatch(title, candidate))) {
      return row;
    }
  }
  return null;
}

function enrichFromRow(entry: SeasonalLineupEntry, row: JikanSeasonRow): SeasonalLineupEntry {
  return {
    ...entry,
    malId: row.mal_id,
    posterUrl: posterFromRow(row),
    story: row.synopsis?.trim() || entry.story || null,
    malUrl: row.url ?? `https://myanimelist.net/anime/${row.mal_id}`,
  };
}

export async function enrichSeasonalLineup(
  entries: SeasonalLineupEntry[] = buildSummer2026SeasonalLineup(),
): Promise<SeasonalLineupEntry[]> {
  const catalog = await fetchJikanSummer2026Catalog();
  const enriched: SeasonalLineupEntry[] = [];

  for (const entry of entries) {
    let next: SeasonalLineupEntry = { ...entry };
    const catalogRow = matchCatalogRow(entry.title, catalog);

    if (catalogRow) {
      next = enrichFromRow(entry, catalogRow);
    } else {
      const malId = CONTINUING_MAL_IDS[entry.title];
      if (malId) {
        const detail = await fetchJikanAnimeDetail(malId);
        if (detail) {
          next = {
            ...entry,
            malId: detail.malId,
            posterUrl: detail.posterUrl,
            story: detail.synopsis ?? entry.story ?? null,
            malUrl: detail.malUrl,
          };
        }
        await sleep(FETCH_DELAY_MS);
      }
    }

    enriched.push(next);
  }

  return enriched;
}

export async function getEnrichedSummer2026Lineup(
  stored: SeasonalLineupEntry[] = [],
): Promise<SeasonalLineupEntry[]> {
  const hasRichData =
    stored.length > 0 && stored.filter((entry) => entry.posterUrl && entry.story).length >= 20;

  if (hasRichData) return stored;

  return enrichSeasonalLineup(stored.length > 0 ? stored : buildSummer2026SeasonalLineup());
}
