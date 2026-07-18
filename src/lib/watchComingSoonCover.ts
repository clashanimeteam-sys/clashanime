export const WATCH_COMING_SOON_COVER_KEY = "watch_coming_soon_cover";

export const DEFAULT_WATCH_COMING_SOON_COVER = {
  videoUrl: "/animevideo.mp4",
  posterUrl: "/animevideo-poster.jpg",
} as const;

export type WatchComingSoonCover = {
  videoUrl: string;
  posterUrl: string;
};

function asTrimmedUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("/")) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function parseWatchComingSoonCover(value: unknown): WatchComingSoonCover {
  const record = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    videoUrl: asTrimmedUrl(record.videoUrl) ?? DEFAULT_WATCH_COMING_SOON_COVER.videoUrl,
    posterUrl: asTrimmedUrl(record.posterUrl) ?? DEFAULT_WATCH_COMING_SOON_COVER.posterUrl,
  };
}
