import { createServerClient } from "@/lib/supabase/server";
import {
  assignClashRanks,
  assignGlobalRanks,
  attachClashRanks,
  calculateTrendingScore,
  CLASH_TOP_COUNT,
} from "@/lib/videoRanking";
import type { Video, VideoChannel } from "@/lib/types";

const MOCK_VIDEOS: Video[] = [
  {
    id: "1",
    title: "Gojo vs Sukuna — Domain Clash",
    thumbnail_url: "https://picsum.photos/seed/clash1/540/960",
    video_url: "",
    likes_count: 48200,
    comments_count: 3180,
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    trending_score: 0,
  },
  {
    id: "2",
    title: "Luffy Gear 5 Animation Duel",
    thumbnail_url: "https://picsum.photos/seed/clash2/540/960",
    video_url: "",
    likes_count: 39100,
    comments_count: 2740,
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    trending_score: 0,
  },
  {
    id: "3",
    title: "Naruto Rasengan vs Sasuke Chidori",
    thumbnail_url: "https://picsum.photos/seed/clash3/540/960",
    video_url: "",
    likes_count: 35600,
    comments_count: 2100,
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    trending_score: 0,
  },
  {
    id: "4",
    title: "Demon Slayer Water vs Thunder Breathing",
    thumbnail_url: "https://picsum.photos/seed/clash4/540/960",
    video_url: "",
    likes_count: 28900,
    comments_count: 1650,
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    trending_score: 0,
  },
  {
    id: "5",
    title: "Attack on Titan ODM Gear Chase",
    thumbnail_url: "https://picsum.photos/seed/clash5/540/960",
    video_url: "",
    likes_count: 22100,
    comments_count: 980,
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    trending_score: 0,
  },
  {
    id: "6",
    title: "Bleach Bankai Reveal Edit",
    thumbnail_url: "https://picsum.photos/seed/clash6/540/960",
    video_url: "",
    likes_count: 18700,
    comments_count: 740,
    created_at: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    trending_score: 0,
  },
];

const USE_MOCK_VIDEOS = process.env.NODE_ENV !== "production";

function mockVideosWithTrending(): Video[] {
  if (!USE_MOCK_VIDEOS) return [];
  return MOCK_VIDEOS.map((video) => ({
    ...video,
    trending_score: calculateTrendingScore(video),
  }));
}

export async function attachVideoChannels(
  supabase: NonNullable<Awaited<ReturnType<typeof createServerClient>>>,
  videos: Array<Omit<Video, "trending_score" | "channel"> & { user_id?: string | null }>,
): Promise<Video[]> {
  const userIds = [
    ...new Set(videos.map((video) => video.user_id).filter(Boolean)),
  ] as string[];

  let profileMap = new Map<string, VideoChannel>();

  if (userIds.length > 0) {
    const [{ data: profiles }, { data: follows }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url, is_verified, level, points")
        .in("id", userIds),
      supabase.from("channel_follows").select("following_id").in("following_id", userIds),
    ]);

    const followerCounts = new Map<string, number>();
    for (const follow of follows ?? []) {
      followerCounts.set(
        follow.following_id,
        (followerCounts.get(follow.following_id) ?? 0) + 1,
      );
    }

    profileMap = new Map(
      (profiles ?? []).map((profile) => [
        profile.id,
        {
          username: profile.username,
          display_name: profile.display_name,
          avatar_url: profile.avatar_url,
          follower_count: followerCounts.get(profile.id) ?? 0,
          is_verified: profile.is_verified,
          level: profile.level,
          points: profile.points,
        },
      ]),
    );
  }

  return videos.map((video) => ({
    ...video,
    moderation_status: "approved" as const,
    trending_score: 0,
    channel: video.user_id ? (profileMap.get(video.user_id) ?? null) : null,
  }));
}

const APPROVED_VIDEO_SELECT =
  "id, title, thumbnail_url, video_url, likes_count, comments_count, views_count, shares_count, created_at, user_id, hashtags";

async function fetchApprovedVideoPool(): Promise<Video[]> {
  const supabase = await createServerClient();

  if (!supabase) {
    return mockVideosWithTrending();
  }

  const { data, error } = await supabase
    .from("videos")
    .select(APPROVED_VIDEO_SELECT)
    .eq("moderation_status", "approved")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error || !data?.length) {
    return mockVideosWithTrending();
  }

  const withChannels = await attachVideoChannels(supabase, data);
  return withChannels.map((video) => ({
    ...video,
    trending_score: calculateTrendingScore(video),
  }));
}

async function fetchApprovedVideos(): Promise<Video[]> {
  return assignGlobalRanks(await fetchApprovedVideoPool());
}

/** Approved videos with channel data for live clash ranking (no ranks assigned). */
export async function getApprovedVideoPool(): Promise<Video[]> {
  return fetchApprovedVideoPool();
}

async function awardClashTrendingBonuses(videos: Video[]): Promise<void> {
  const supabase = await createServerClient();
  if (!supabase) return;

  await Promise.all(
    videos
      .slice(0, CLASH_TOP_COUNT)
      .map((video) => supabase.rpc("award_trending_bonus", { target_video_id: video.id })),
  );
}

export async function getGloballyRankedVideos(): Promise<Video[]> {
  return fetchApprovedVideos();
}

export async function getClashRankedVideos(): Promise<Video[]> {
  return assignClashRanks(await fetchApprovedVideoPool());
}

export type ClashArenaStats = {
  /** All approved videos on the platform. */
  activeBattles: number;
  /** Total engagement across all videos (likes + comments + views + shares). */
  heroesFighting: number;
};

function mockArenaStats(): ClashArenaStats {
  if (!USE_MOCK_VIDEOS) {
    return { activeBattles: 0, heroesFighting: 0 };
  }

  const engagement = MOCK_VIDEOS.reduce(
    (sum, video) =>
      sum +
      video.likes_count +
      video.comments_count +
      (video.views_count ?? 0) +
      (video.shares_count ?? 0),
    0,
  );
  return { activeBattles: MOCK_VIDEOS.length, heroesFighting: engagement };
}

export async function getClashArenaStats(): Promise<ClashArenaStats> {
  const supabase = await createServerClient();

  if (!supabase) {
    return mockArenaStats();
  }

  const { data, error, count } = await supabase
    .from("videos")
    .select("likes_count, comments_count, views_count, shares_count", { count: "exact" })
    .eq("moderation_status", "approved");

  if (error || !data) {
    return mockArenaStats();
  }

  const heroesFighting = data.reduce(
    (sum, video) =>
      sum +
      (video.likes_count ?? 0) +
      (video.comments_count ?? 0) +
      (video.views_count ?? 0) +
      (video.shares_count ?? 0),
    0,
  );

  return {
    activeBattles: count ?? data.length,
    heroesFighting,
  };
}

/** Top 12 engagement-ranked videos for the Clash (النزالات) feed. */
export async function getClashVideos(): Promise<Video[]> {
  const ranked = await getClashRankedVideos();
  const top = ranked
    .slice(0, CLASH_TOP_COUNT)
    .sort((a, b) => (a.global_rank ?? 999) - (b.global_rank ?? 999));
  await awardClashTrendingBonuses(top);
  return top;
}

/** All approved videos, newest first, with trending rank and clash engagement rank. */
export async function getVideosCatalog(): Promise<Video[]> {
  const pool = await fetchApprovedVideoPool();
  const ranked = assignGlobalRanks(pool);
  const rankById = new Map(ranked.map((video) => [video.id, video.global_rank ?? 0]));
  const withClashRanks = attachClashRanks(pool);
  const clashRankById = new Map(withClashRanks.map((video) => [video.id, video.clash_rank]));

  return [...pool]
    .sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .map((video) => ({
      ...video,
      global_rank: rankById.get(video.id),
      clash_rank: clashRankById.get(video.id),
      trending_score: ranked.find((entry) => entry.id === video.id)?.trending_score ?? video.trending_score,
    }));
}

/** @deprecated Use getClashVideos() */
export async function getTrendingVideos(): Promise<Video[]> {
  return getClashVideos();
}

export async function getRecentVideos(limit = 48): Promise<Video[]> {
  const catalog = await getVideosCatalog();
  return catalog.slice(0, limit);
}

export async function getGlobalRankMap(): Promise<Record<string, number>> {
  const ranked = await getClashRankedVideos();
  return Object.fromEntries(
    ranked.map((video) => [video.id, video.global_rank ?? 0]),
  );
}

export async function getTrendingRankMap(): Promise<Record<string, number>> {
  const ranked = await fetchApprovedVideos();
  return Object.fromEntries(
    ranked.map((video) => [video.id, video.global_rank ?? 0]),
  );
}

export async function getVerifiedCreatorVideos(limit = 24): Promise<Video[]> {
  const supabase = await createServerClient();

  if (!supabase) {
    return [];
  }

  const { data: verifiedProfiles } = await supabase
    .from("profiles")
    .select("id")
    .eq("is_verified", true);

  const creatorIds = (verifiedProfiles ?? []).map((profile) => profile.id);

  if (creatorIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("videos")
    .select(APPROVED_VIDEO_SELECT)
    .eq("moderation_status", "approved")
    .in("user_id", creatorIds)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data?.length) {
    return [];
  }

  return attachVideoChannels(supabase, data);
}

export async function getVideoById(id: string): Promise<Video | null> {
  const supabase = await createServerClient();

  if (!supabase) {
    if (!USE_MOCK_VIDEOS) return null;
    return MOCK_VIDEOS.find((video) => video.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from("videos")
    .select(
      "id, title, thumbnail_url, video_url, likes_count, comments_count, views_count, shares_count, created_at, user_id, hashtags, duration_seconds, description",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const [video] = await attachVideoChannels(supabase, [data]);
  const pool = await fetchApprovedVideoPool();
  const trending = assignGlobalRanks(pool).find((entry) => entry.id === id);
  const clash = attachClashRanks(pool).find((entry) => entry.id === id);
  return trending
    ? {
        ...video,
        global_rank: trending.global_rank,
        clash_rank: clash?.clash_rank,
        trending_score: trending.trending_score,
      }
    : video;
}
