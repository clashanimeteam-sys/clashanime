import { watchNowAnimePath } from "@/lib/animeNews/watchNowPaths";

export function watchNowMalPath(malId: number) {
  return `/blog/anime-news/watch-now/mal/${malId}`;
}

export function resolveWatchNowGuidePath(malId: number, catalogKey: string | null): string {
  if (catalogKey) {
    return watchNowAnimePath(catalogKey);
  }

  return watchNowMalPath(malId);
}
