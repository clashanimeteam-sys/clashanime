import type { Video } from "@/lib/types";

function normalizeSearchQuery(query: string) {
  return query.trim().toLowerCase();
}

function videoSearchHaystack(video: Video) {
  return [
    video.title,
    video.description,
    video.channel?.username,
    video.channel?.display_name,
    ...(video.hashtags ?? []),
    ...(video.hashtags ?? []).map((tag) => `#${tag}`),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function filterVideosByQuery(videos: Video[], query: string): Video[] {
  const normalized = normalizeSearchQuery(query);
  if (!normalized) return videos;

  return videos.filter((video) => videoSearchHaystack(video).includes(normalized));
}
