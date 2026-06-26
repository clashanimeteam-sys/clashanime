import type { Video } from "@/lib/types";
import { assignGlobalRanks, CLASH_TOP_COUNT } from "@/lib/videoRanking";
import type { VideoEngagementDelta } from "@/lib/videoEngagementEvents";

type VideoEngagementRow = {
  id: string;
  likes_count?: number;
  comments_count?: number;
  views_count?: number;
  shares_count?: number;
  moderation_status?: string;
};

export function patchVideoEngagement(pool: Video[], delta: VideoEngagementDelta): Video[] {
  return pool.map((video) =>
    video.id === delta.videoId
      ? {
          ...video,
          ...(delta.likes_count !== undefined ? { likes_count: delta.likes_count } : {}),
          ...(delta.comments_count !== undefined ? { comments_count: delta.comments_count } : {}),
          ...(delta.views_count !== undefined ? { views_count: delta.views_count } : {}),
          ...(delta.shares_count !== undefined ? { shares_count: delta.shares_count } : {}),
        }
      : video,
  );
}

export function patchVideoFromRow(pool: Video[], row: VideoEngagementRow): Video[] {
  const index = pool.findIndex((video) => video.id === row.id);
  if (index === -1) return pool;

  const current = pool[index];
  const next: Video = {
    ...current,
    likes_count: row.likes_count ?? current.likes_count,
    comments_count: row.comments_count ?? current.comments_count,
    views_count: row.views_count ?? current.views_count,
    shares_count: row.shares_count ?? current.shares_count,
  };

  const updated = [...pool];
  updated[index] = next;
  return updated;
}

export function applyClashRanking(pool: Video[]): Video[] {
  return assignGlobalRanks(pool)
    .slice(0, CLASH_TOP_COUNT)
    .sort((a, b) => (a.global_rank ?? 999) - (b.global_rank ?? 999));
}

export function applyCatalogRanking(pool: Video[]): Video[] {
  const ranked = assignGlobalRanks(pool);
  const rankById = new Map(ranked.map((video) => [video.id, video.global_rank ?? 0]));
  const scoreById = new Map(ranked.map((video) => [video.id, video.trending_score ?? 0]));

  return [...pool]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((video) => ({
      ...video,
      global_rank: rankById.get(video.id),
      trending_score: scoreById.get(video.id) ?? video.trending_score ?? 0,
    }));
}

export type LiveRankingMode = "clash" | "catalog";

export function applyLiveRanking(pool: Video[], mode: LiveRankingMode): Video[] {
  return mode === "clash" ? applyClashRanking(pool) : applyCatalogRanking(pool);
}
