export type BeatsTrack = {
  id: string;
  title: string;
  artist: string;
  animeTitle: string | null;
  youtubeVideoId: string;
  artworkUrl: string | null;
  voteCount: number;
  sortOrder: number;
  userHasVoted: boolean;
};

export function youtubeThumbnail(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function extractYoutubeVideoId(input: string): string | null {
  const raw = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = raw.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

export function trackArtwork(track: Pick<BeatsTrack, "artworkUrl" | "youtubeVideoId">) {
  return track.artworkUrl ?? youtubeThumbnail(track.youtubeVideoId);
}

const SUBMIT_ERROR_KEYS = {
  "valid title required": "errorTitleRequired",
  "valid artist required": "errorArtistRequired",
  "youtube url or video id required": "errorYoutubeRequired",
  "invalid youtube url or video id": "errorYoutubeInvalid",
  "invalid artwork url": "errorCoverInvalid",
  "login required": "loginToSubmit",
} as const;

export function isValidArtworkUrl(input: string): boolean {
  const raw = input.trim();
  if (!raw) return true;

  try {
    const url = new URL(raw);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function mapBeatsSubmitError(
  message: string,
  errors: Record<(typeof SUBMIT_ERROR_KEYS)[keyof typeof SUBMIT_ERROR_KEYS], string>,
): string {
  const normalized = message.toLowerCase();
  for (const [needle, key] of Object.entries(SUBMIT_ERROR_KEYS)) {
    if (normalized.includes(needle)) {
      return errors[key];
    }
  }
  return message;
}

export function validateBeatsSubmission(input: {
  title: string;
  artist: string;
  youtubeUrl: string;
  artworkUrl?: string;
  errors: Record<(typeof SUBMIT_ERROR_KEYS)[keyof typeof SUBMIT_ERROR_KEYS], string>;
}): string | null {
  if (!input.title.trim()) return input.errors.errorTitleRequired;
  if (!input.artist.trim()) return input.errors.errorArtistRequired;
  if (!input.youtubeUrl.trim()) return input.errors.errorYoutubeRequired;
  if (!extractYoutubeVideoId(input.youtubeUrl.trim())) return input.errors.errorYoutubeInvalid;
  if (input.artworkUrl && !isValidArtworkUrl(input.artworkUrl)) return input.errors.errorCoverInvalid;
  return null;
}
