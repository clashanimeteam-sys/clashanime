const JIKAN_API = "https://api.jikan.moe/v4";

export type CatalogCard = {
  id: number;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  score: number | null;
  malUrl: string;
  kind: "anime" | "manga" | "character";
};

type JikanImage = {
  jpg?: { large_image_url?: string | null; image_url?: string | null };
  webp?: { large_image_url?: string | null; image_url?: string | null };
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pickImage(images?: JikanImage | null): string | null {
  return (
    images?.jpg?.large_image_url ??
    images?.webp?.large_image_url ??
    images?.jpg?.image_url ??
    images?.webp?.image_url ??
    null
  );
}

async function jikanGet<T>(path: string): Promise<T | null> {
  const response = await fetch(`${JIKAN_API}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });

  if (response.status === 429) {
    await sleep(1200);
    return jikanGet(path);
  }

  if (!response.ok) return null;
  return (await response.json()) as T;
}

export async function fetchTopAnimeCatalog(limit = 24): Promise<CatalogCard[]> {
  const payload = await jikanGet<{
    data?: Array<{
      mal_id: number;
      title?: string;
      title_english?: string | null;
      title_japanese?: string | null;
      score?: number | null;
      url?: string;
      images?: JikanImage;
    }>;
  }>(`/top/anime?filter=bypopularity&limit=${Math.min(limit, 25)}`);

  return (payload?.data ?? []).slice(0, limit).map((row) => ({
    id: row.mal_id,
    title: row.title_english?.trim() || row.title?.trim() || row.title_japanese?.trim() || "Anime",
    subtitle: row.title_japanese?.trim() || null,
    imageUrl: pickImage(row.images),
    score: row.score ?? null,
    malUrl: row.url ?? `https://myanimelist.net/anime/${row.mal_id}`,
    kind: "anime" as const,
  }));
}

export async function fetchTopMangaCatalog(limit = 24): Promise<CatalogCard[]> {
  const payload = await jikanGet<{
    data?: Array<{
      mal_id: number;
      title?: string;
      title_english?: string | null;
      title_japanese?: string | null;
      score?: number | null;
      url?: string;
      images?: JikanImage;
      authors?: Array<{ name?: string }>;
    }>;
  }>(`/top/manga?filter=bypopularity&limit=${Math.min(limit, 25)}`);

  return (payload?.data ?? []).slice(0, limit).map((row) => ({
    id: row.mal_id,
    title: row.title_english?.trim() || row.title?.trim() || row.title_japanese?.trim() || "Manga",
    subtitle: row.authors?.[0]?.name?.trim() || row.title_japanese?.trim() || null,
    imageUrl: pickImage(row.images),
    score: row.score ?? null,
    malUrl: row.url ?? `https://myanimelist.net/manga/${row.mal_id}`,
    kind: "manga" as const,
  }));
}

export async function fetchTopCharactersCatalog(limit = 24): Promise<CatalogCard[]> {
  const payload = await jikanGet<{
    data?: Array<{
      mal_id: number;
      name?: string;
      name_kanji?: string | null;
      url?: string;
      images?: JikanImage;
      favorites?: number | null;
    }>;
  }>(`/top/characters?limit=${Math.min(limit, 25)}`);

  return (payload?.data ?? []).slice(0, limit).map((row) => ({
    id: row.mal_id,
    title: row.name?.trim() || "Character",
    subtitle: row.name_kanji?.trim() || null,
    imageUrl: pickImage(row.images),
    score: null,
    malUrl: row.url ?? `https://myanimelist.net/character/${row.mal_id}`,
    kind: "character" as const,
  }));
}
