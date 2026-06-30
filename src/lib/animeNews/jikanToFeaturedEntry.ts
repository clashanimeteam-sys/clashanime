import type { FeaturedAnimeEntry } from "@/lib/animeNews/featuredAnimeCatalog";
import type { JikanAnimeDetail } from "@/lib/jikan";

export function jikanDetailToFeaturedEntry(detail: JikanAnimeDetail): FeaturedAnimeEntry {
  return {
    key: `mal-${detail.malId}`,
    title: detail.titleEnglish?.trim() || detail.title,
    category: "legends",
    priority: 9999,
    malId: detail.malId,
    posterUrl: detail.posterUrl,
    synopsis: detail.synopsis,
    youtubeId: detail.youtubeId,
    malUrl: detail.malUrl,
  };
}
