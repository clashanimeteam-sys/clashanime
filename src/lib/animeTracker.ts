export type AnimeReleaseStatus = "scheduled" | "released" | "cancelled";

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
};

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
};

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
};

export type AnimeReleaseClashDetail = AnimeReleaseClash & {
  clashStatus: string;
};

export function localizedAnimeTitle(
  release: Pick<AnimeRelease, "title" | "titleAr" | "titleJa">,
  locale: "en" | "ja" | "ar",
): string {
  if (locale === "ar" && release.titleAr) return release.titleAr;
  if (locale === "ja" && release.titleJa) return release.titleJa;
  return release.title;
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
