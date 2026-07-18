export const WATCH_COMING_SOON_COVER_KEY = "watch_coming_soon_cover";

export const DEFAULT_WATCH_COMING_SOON_COVER = {
  videoUrl: "/animevideo.mp4",
  posterUrl: "/animevideo-poster.jpg",
  /** Seconds the poster stays before fading (even if video is still buffering). */
  posterHideSeconds: 1.5,
  muted: true,
  /** Black overlay strength 0–100 (0 = none, 100 = solid black). */
  overlayOpacity: 40,
} as const;

export type WatchComingSoonCover = {
  videoUrl: string;
  posterUrl: string;
  posterHideSeconds: number;
  muted: boolean;
  overlayOpacity: number;
};

function asTrimmedUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  let trimmed = value.trim();
  if (!trimmed) return null;
  // Fix common paste mistakes like "/poster.jpg/"
  if (trimmed.startsWith("/") && trimmed.length > 1) {
    trimmed = trimmed.replace(/\/+$/, "") || trimmed;
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  }
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

function asSeconds(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(10, Math.max(0, Math.round(n * 10) / 10));
}

function asOpacity(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(100, Math.max(0, Math.round(n)));
}

export function parseWatchComingSoonCover(value: unknown): WatchComingSoonCover {
  const record = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    videoUrl: asTrimmedUrl(record.videoUrl) ?? DEFAULT_WATCH_COMING_SOON_COVER.videoUrl,
    posterUrl: asTrimmedUrl(record.posterUrl) ?? DEFAULT_WATCH_COMING_SOON_COVER.posterUrl,
    posterHideSeconds: asSeconds(record.posterHideSeconds, DEFAULT_WATCH_COMING_SOON_COVER.posterHideSeconds),
    muted: record.muted === undefined ? DEFAULT_WATCH_COMING_SOON_COVER.muted : Boolean(record.muted),
    overlayOpacity: asOpacity(record.overlayOpacity, DEFAULT_WATCH_COMING_SOON_COVER.overlayOpacity),
  };
}
