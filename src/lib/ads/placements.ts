export const AD_PLACEMENTS_KEY = "ad_placements";

export type AdPageKey = "home" | "blog" | "videos" | "videoReels" | "community" | "tracker" | "watch";

export type AdPlacementSettings = {
  enabled: boolean;
  showPreviewPlaceholders: boolean;
  pages: Record<AdPageKey, boolean>;
  reelsEveryNVideos: number;
  slotBanner: string;
  slotInFeed: string;
  slotWatchBanner: string;
  slotWatchPopunder: string;
};

export const AD_PAGE_KEYS: AdPageKey[] = [
  "home",
  "blog",
  "videos",
  "videoReels",
  "community",
  "tracker",
  "watch",
];

export const MIN_REELS_AD_INTERVAL = 2;
export const MAX_REELS_AD_INTERVAL = 10;
export const DEFAULT_REELS_AD_INTERVAL = 4;

export const DEFAULT_AD_PLACEMENTS: AdPlacementSettings = {
  enabled: false,
  showPreviewPlaceholders: true,
  pages: {
    home: false,
    blog: true,
    videos: true,
    videoReels: true,
    community: false,
    tracker: false,
    watch: false,
  },
  reelsEveryNVideos: DEFAULT_REELS_AD_INTERVAL,
  slotBanner: "",
  slotInFeed: "",
  slotWatchBanner: "",
  slotWatchPopunder: "",
};

function clampReelsInterval(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return DEFAULT_REELS_AD_INTERVAL;
  return Math.min(MAX_REELS_AD_INTERVAL, Math.max(MIN_REELS_AD_INTERVAL, Math.round(parsed)));
}

function parsePageFlags(raw: unknown): Record<AdPageKey, boolean> {
  const source = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return AD_PAGE_KEYS.reduce(
    (acc, key) => {
      acc[key] = Boolean(source[key] ?? DEFAULT_AD_PLACEMENTS.pages[key]);
      return acc;
    },
    {} as Record<AdPageKey, boolean>,
  );
}

export function parseAdPlacementSettings(raw: unknown): AdPlacementSettings {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_AD_PLACEMENTS, pages: { ...DEFAULT_AD_PLACEMENTS.pages } };
  }

  const value = raw as Partial<AdPlacementSettings>;
  return {
    enabled: Boolean(value.enabled),
    showPreviewPlaceholders:
      value.showPreviewPlaceholders ?? DEFAULT_AD_PLACEMENTS.showPreviewPlaceholders,
    pages: parsePageFlags(value.pages),
    reelsEveryNVideos: clampReelsInterval(value.reelsEveryNVideos),
    slotBanner: typeof value.slotBanner === "string" ? value.slotBanner.trim() : "",
    slotInFeed: typeof value.slotInFeed === "string" ? value.slotInFeed.trim() : "",
    slotWatchBanner: typeof value.slotWatchBanner === "string" ? value.slotWatchBanner.trim() : "",
    slotWatchPopunder:
      typeof value.slotWatchPopunder === "string" ? value.slotWatchPopunder.trim() : "",
  };
}

export function isAdPageEnabled(settings: AdPlacementSettings, page: AdPageKey): boolean {
  return settings.enabled && settings.pages[page];
}

export type VideoFeedItem =
  | { kind: "video"; video: { id: string } }
  | { kind: "ad"; id: string };

export function buildVideoFeedWithAds<T extends { id: string }>(
  videos: T[],
  everyN: number,
  enabled: boolean,
): Array<{ kind: "video"; video: T } | { kind: "ad"; id: string }> {
  if (!enabled || everyN < MIN_REELS_AD_INTERVAL) {
    return videos.map((video) => ({ kind: "video" as const, video }));
  }

  const result: Array<{ kind: "video"; video: T } | { kind: "ad"; id: string }> = [];
  let videoCount = 0;

  for (const video of videos) {
    result.push({ kind: "video", video });
    videoCount += 1;
    if (videoCount % everyN === 0) {
      result.push({ kind: "ad", id: `reels-ad-${videoCount}` });
    }
  }

  return result;
}
