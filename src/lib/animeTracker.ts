import type { JikanAnimeEntry } from "@/lib/jikan";

export type AnimeReleaseStatus = "scheduled" | "released" | "cancelled";

export type AnimeSynopsis = {
  synopsisEn: string | null;
  synopsisAr: string | null;
  synopsisJa: string | null;
};

export type AnimeRelease = {
  id: string;
  title: string;
  titleAr: string | null;
  titleJa: string | null;
  releaseDate: string;
  airsAt: string | null;
  episodeNumber: number;
  posterUrl: string | null;
  matchTags: string[];
  status: AnimeReleaseStatus;
  clashId: string | null;
  clashStatus: string | null;
  clashOpensAt: string | null;
  malId: number | null;
} & AnimeSynopsis;

export type AnimeReleaseUpcoming = {
  id: string;
  title: string;
  titleAr: string | null;
  titleJa: string | null;
  releaseDate: string;
  airsAt: string | null;
  episodeNumber: number;
  posterUrl: string | null;
  status: AnimeReleaseStatus;
} & AnimeSynopsis;

export type AnimeReleaseClash = {
  clashId: string;
  clashTitle: string;
  releaseId: string;
  animeTitle: string;
  titleAr: string | null;
  titleJa: string | null;
  episodeNumber: number;
  posterUrl: string | null;
  matchTags: string[];
  opensAt: string;
  closesAt: string | null;
  clipCount: number;
} & AnimeSynopsis;

export type AnimeReleaseClashDetail = AnimeReleaseClash & {
  clashStatus: string;
};

export type TrendingSpotlightCard = {
  rank: number;
  editorialEn: string | null;
  editorialAr: string | null;
  editorialJa: string | null;
  releaseId: string | null;
  clashId: string | null;
  animeTitle: string;
  titleAr: string | null;
  titleJa: string | null;
  episodeNumber: number;
  episodesTotal: number | null;
  posterUrl: string | null;
  malScore: number | null;
  broadcastLabel: string | null;
  airingStatus: string | null;
  matchTags: string[];
  opensAt: string | null;
  closesAt: string | null;
  clipCount: number;
} & AnimeSynopsis;

export function localizedAnimeTitle(
  release: Pick<AnimeRelease, "title" | "titleAr" | "titleJa">,
  locale: "en" | "ja" | "ar",
): string {
  if (locale === "ar" && release.titleAr) return release.titleAr;
  if (locale === "ja" && release.titleJa) return release.titleJa;
  return release.title;
}

export function localizedAnimeSynopsis(
  release: AnimeSynopsis,
  locale: "en" | "ja" | "ar",
): string | null {
  if (locale === "ar" && release.synopsisAr?.trim()) return release.synopsisAr.trim();
  if (locale === "ja" && release.synopsisJa?.trim()) return release.synopsisJa.trim();
  if (release.synopsisEn?.trim()) return release.synopsisEn.trim();
  return release.synopsisJa?.trim() || release.synopsisAr?.trim() || null;
}

export function localizedTrendingEditorial(
  card: Pick<TrendingSpotlightCard, "editorialEn" | "editorialAr" | "editorialJa">,
  locale: "en" | "ja" | "ar",
): string | null {
  if (locale === "ar" && card.editorialAr?.trim()) return card.editorialAr.trim();
  if (locale === "ja" && card.editorialJa?.trim()) return card.editorialJa.trim();
  return card.editorialEn?.trim() || card.editorialJa?.trim() || card.editorialAr?.trim() || null;
}

export function animeSynopsisEntries(release: AnimeSynopsis): Array<{
  locale: "en" | "ar" | "ja";
  text: string;
}> {
  const entries: Array<{ locale: "en" | "ar" | "ja"; text: string }> = [];
  if (release.synopsisEn?.trim()) entries.push({ locale: "en", text: release.synopsisEn.trim() });
  if (release.synopsisAr?.trim()) entries.push({ locale: "ar", text: release.synopsisAr.trim() });
  if (release.synopsisJa?.trim()) entries.push({ locale: "ja", text: release.synopsisJa.trim() });
  return entries;
}

export function slugifyAnimeTag(value: string): string {
  return value
    .trim()
    .replace(/^#+/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

export function buildMatchTagsFromTitle(title: string, extra: string[] = []): string[] {
  const tags = new Set<string>();
  const slug = slugifyAnimeTag(title);
  if (slug) tags.add(slug);
  for (const tag of extra) {
    const normalized = slugifyAnimeTag(tag);
    if (normalized) tags.add(normalized);
  }
  return [...tags];
}

export function buildClashUploadHref(clashId: string): string {
  return `/upload?clash=${encodeURIComponent(clashId)}`;
}

/** Map cached Supabase release row to tracker card data (fast page load). */
export function releaseToTrackerEntry(
  release: AnimeRelease,
): JikanAnimeEntry & { clashId?: string | null } {
  return {
    malId: release.malId ?? 0,
    title: release.title,
    titleEnglish: release.title,
    titleJapanese: release.titleJa,
    posterUrl: release.posterUrl,
    score: null,
    rank: null,
    genres: [],
    releaseDate: release.releaseDate,
    airsAt: release.airsAt,
    broadcastLabel: null,
    status: release.status,
    episodeNumber: release.episodeNumber,
    matchTags: release.matchTags,
    malUrl: release.malId ? `https://myanimelist.net/anime/${release.malId}` : "",
    clashId: release.clashId,
    synopsisEn: release.synopsisEn,
    synopsisAr: release.synopsisAr,
    synopsisJa: release.synopsisJa,
  };
}

export function upcomingToTrackerEntry(release: AnimeReleaseUpcoming): JikanAnimeEntry {
  return {
    malId: 0,
    title: release.title,
    titleEnglish: release.title,
    titleJapanese: release.titleJa,
    posterUrl: release.posterUrl,
    score: null,
    rank: null,
    genres: [],
    releaseDate: release.releaseDate,
    airsAt: release.airsAt,
    broadcastLabel: null,
    status: release.status,
    episodeNumber: release.episodeNumber,
    matchTags: [],
    malUrl: "",
    synopsisEn: release.synopsisEn,
    synopsisAr: release.synopsisAr,
    synopsisJa: release.synopsisJa,
  };
}
