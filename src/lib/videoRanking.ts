import type { Video } from "@/lib/types";

export const CLASH_TOP_COUNT = 12;

export function calculateTrendingScore(video: Video): number {
  const ageHours =
    (Date.now() - new Date(video.created_at).getTime()) / (1000 * 60 * 60);
  const engagement = video.likes_count + video.comments_count * 2;
  const legendBoost =
    video.channel?.is_verified || (video.channel?.level ?? 0) >= 4 ? 1.2 : 1;
  return (engagement * legendBoost) / Math.pow(ageHours + 2, 1.5);
}

export function sortByTrending(videos: Video[]): Video[] {
  return [...videos]
    .map((video) => ({
      ...video,
      trending_score: calculateTrendingScore(video),
    }))
    .sort((a, b) => b.trending_score - a.trending_score);
}

export function assignGlobalRanks(videos: Video[]): Video[] {
  return sortByTrending(videos).map((video, index) => ({
    ...video,
    global_rank: index + 1,
  }));
}

export function isInClashTop(globalRank: number | undefined): boolean {
  return typeof globalRank === "number" && globalRank >= 1 && globalRank <= CLASH_TOP_COUNT;
}
