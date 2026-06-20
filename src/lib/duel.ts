import {
  calculateTrendingScore,
  CLASH_TOP_COUNT,
  sortByTrending,
} from "@/lib/videoRanking";
import type { Video } from "@/lib/types";

const TRENDING_DUEL_RATIO = 0.85;

export function enrichVideosWithRanks(videos: Video[], ranked: Video[]): Video[] {
  const rankById = new Map(ranked.map((video) => [video.id, video.global_rank ?? 0]));
  const scoreById = new Map(
    ranked.map((video) => [video.id, video.trending_score || calculateTrendingScore(video)]),
  );

  return videos.map((video) => ({
    ...video,
    global_rank: rankById.get(video.id),
    trending_score: scoreById.get(video.id) ?? calculateTrendingScore(video),
  }));
}

export function isTrendingDuel(video: Video, ranked: Video[]): boolean {
  const rank = video.global_rank;
  if (typeof rank !== "number" || rank < 1 || rank > CLASH_TOP_COUNT) {
    return false;
  }

  const sorted = sortByTrending(ranked).slice(0, CLASH_TOP_COUNT);
  const index = sorted.findIndex((entry) => entry.id === video.id);
  if (index === -1) return false;

  const score = video.trending_score || calculateTrendingScore(video);
  const neighbors = [sorted[index - 1], sorted[index + 1]].filter(Boolean);

  return neighbors.some((neighbor) => {
    const neighborScore = neighbor.trending_score || calculateTrendingScore(neighbor);
    const maxScore = Math.max(score, neighborScore);
    if (maxScore <= 0) return false;
    return Math.min(score, neighborScore) / maxScore >= TRENDING_DUEL_RATIO;
  });
}

export function buildTrendingDuelSet(videos: Video[], ranked: Video[]): Set<string> {
  const enriched = enrichVideosWithRanks(videos, ranked);
  return new Set(
    enriched.filter((video) => isTrendingDuel(video, ranked)).map((video) => video.id),
  );
}

export function pickRandomDuelPair(videos: Video[]): { left: Video; right: Video } | null {
  const pool = videos.filter((video) => video.video_url || video.thumbnail_url);
  if (pool.length < 2) return null;

  const leftIndex = Math.floor(Math.random() * pool.length);
  let rightIndex = Math.floor(Math.random() * (pool.length - 1));
  if (rightIndex >= leftIndex) rightIndex += 1;

  return {
    left: pool[leftIndex],
    right: pool[rightIndex],
  };
}
