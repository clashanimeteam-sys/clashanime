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
