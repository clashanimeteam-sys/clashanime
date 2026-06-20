import { createServerClient } from "@/lib/supabase/server";
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

function calculateTrendingScore(video: Video): number {
  const ageHours =
    (Date.now() - new Date(video.created_at).getTime()) / (1000 * 60 * 60);
  const engagement = video.likes_count + video.comments_count * 2;
  return engagement / Math.pow(ageHours + 2, 1.5);
}

function sortByTrending(videos: Video[]): Video[] {
  return [...videos]
    .map((video) => ({
      ...video,
      trending_score: calculateTrendingScore(video),
    }))
    .sort((a, b) => b.trending_score - a.trending_score);
}

async function attachChannels(
  supabase: NonNullable<Awaited<ReturnType<typeof createServerClient>>>,
  videos: Array<Omit<Video, "trending_score" | "channel"> & { user_id?: string | null }>,
): Promise<Video[]> {
  const userIds = [
    ...new Set(videos.map((video) => video.user_id).filter(Boolean)),
  ] as string[];

  let profileMap = new Map<string, VideoChannel>();

  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url")
      .in("id", userIds);

    profileMap = new Map(
      (profiles ?? []).map((profile) => [
        profile.id,
        {
          username: profile.username,
          display_name: profile.display_name,
          avatar_url: profile.avatar_url,
        },
      ]),
    );
  }

  return videos.map((video) => ({
    ...video,
    trending_score: 0,
    channel: video.user_id ? (profileMap.get(video.user_id) ?? null) : null,
  }));
}

export async function getTrendingVideos(): Promise<Video[]> {
  const supabase = await createServerClient();

  if (!supabase) {
    return sortByTrending(MOCK_VIDEOS);
  }

  const { data, error } = await supabase
    .from("videos")
    .select(
      "id, title, thumbnail_url, video_url, likes_count, comments_count, created_at, user_id",
    )
    .order("likes_count", { ascending: false })
    .limit(24);

  if (error || !data?.length) {
    return sortByTrending(MOCK_VIDEOS);
  }

  const withChannels = await attachChannels(supabase, data);
  return sortByTrending(withChannels);
}
