import { getJstDateParts } from "@/lib/jikan";
import { createServerClient } from "@/lib/supabase/server";
import type {
  AnimeRelease,
  AnimeReleaseClash,
  AnimeReleaseClashDetail,
  AnimeReleaseUpcoming,
} from "@/lib/animeTracker";
import type { Video, VideoChannel } from "@/lib/types";

type ReleaseRow = {
  id: string;
  title: string;
  title_ar: string | null;
  title_ja: string | null;
  mal_id: number | null;
  release_date: string;
  airs_at: string | null;
  episode_number: number;
  poster_url: string | null;
  match_tags: string[] | null;
  status: AnimeRelease["status"];
  clash_id: string | null;
  clash_status: string | null;
  clash_opens_at: string | null;
};

type UpcomingRow = Omit<ReleaseRow, "match_tags" | "clash_id" | "clash_status" | "clash_opens_at">;

type ClashRow = {
  clash_id: string;
  clash_title: string;
  release_id: string;
  anime_title: string;
  title_ar: string | null;
  title_ja: string | null;
  episode_number: number;
  poster_url: string | null;
  match_tags: string[] | null;
  opens_at: string;
  closes_at: string | null;
  clip_count: number;
  clash_status?: string;
};

function mapRelease(row: ReleaseRow): AnimeRelease {
  return {
    id: row.id,
    title: row.title,
    titleAr: row.title_ar,
    titleJa: row.title_ja,
    releaseDate: row.release_date,
    airsAt: row.airs_at,
    episodeNumber: Number(row.episode_number),
    posterUrl: row.poster_url,
    matchTags: row.match_tags ?? [],
    status: row.status,
    clashId: row.clash_id,
    clashStatus: row.clash_status,
    clashOpensAt: row.clash_opens_at,
    malId: row.mal_id,
  };
}

function mapUpcoming(row: UpcomingRow): AnimeReleaseUpcoming {
  return {
    id: row.id,
    title: row.title,
    titleAr: row.title_ar,
    titleJa: row.title_ja,
    releaseDate: row.release_date,
    airsAt: row.airs_at,
    episodeNumber: Number(row.episode_number),
    posterUrl: row.poster_url,
    status: row.status,
  };
}

function mapClash(row: ClashRow): AnimeReleaseClash {
  return {
    clashId: row.clash_id,
    clashTitle: row.clash_title,
    releaseId: row.release_id,
    animeTitle: row.anime_title,
    titleAr: row.title_ar,
    titleJa: row.title_ja,
    episodeNumber: Number(row.episode_number),
    posterUrl: row.poster_url,
    matchTags: row.match_tags ?? [],
    opensAt: row.opens_at,
    closesAt: row.closes_at,
    clipCount: Number(row.clip_count),
  };
}

async function attachChannels(
  supabase: NonNullable<Awaited<ReturnType<typeof createServerClient>>>,
  videos: Array<{
    id: string;
    title: string;
    thumbnail_url: string;
    video_url: string;
    likes_count: number;
    comments_count: number;
    created_at: string;
    user_id: string | null;
    hashtags: string[] | null;
    rank_position: number;
  }>,
): Promise<Array<Video & { clashRank: number }>> {
  const userIds = [...new Set(videos.map((video) => video.user_id).filter(Boolean))] as string[];
  let profileMap = new Map<string, VideoChannel>();

  if (userIds.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url, is_verified, level, points")
      .in("id", userIds);

    profileMap = new Map(
      (profiles ?? []).map((profile) => [
        profile.id,
        {
          username: profile.username,
          display_name: profile.display_name,
          avatar_url: profile.avatar_url,
          is_verified: profile.is_verified ?? false,
          level: profile.level ?? 1,
          points: profile.points ?? 0,
        },
      ]),
    );
  }

  return videos.map((video) => ({
    id: video.id,
    title: video.title,
    thumbnail_url: video.thumbnail_url,
    video_url: video.video_url,
    likes_count: video.likes_count,
    comments_count: video.comments_count,
    created_at: video.created_at,
    user_id: video.user_id,
    hashtags: video.hashtags ?? [],
    trending_score: video.likes_count + video.comments_count * 2,
    global_rank: Number(video.rank_position),
    channel: video.user_id ? profileMap.get(video.user_id) ?? null : null,
    clashRank: Number(video.rank_position),
  }));
}

export async function getTodayClashLinksByMalId(): Promise<Map<number, string>> {
  const supabase = await createServerClient();
  if (!supabase) return new Map();

  const { date } = getJstDateParts();

  const { data, error } = await supabase
    .from("anime_releases")
    .select("mal_id, clash_id")
    .eq("release_date", date)
    .not("mal_id", "is", null)
    .not("clash_id", "is", null);

  if (error || !data) return new Map();

  return new Map(
    data
      .filter((row) => row.mal_id && row.clash_id)
      .map((row) => [Number(row.mal_id), String(row.clash_id)]),
  );
}

export async function getAnimeTrackerToday(): Promise<AnimeRelease[]> {
  const supabase = await createServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase.rpc("get_anime_tracker_today");
  if (error || !data) return [];

  return (data as ReleaseRow[]).map(mapRelease);
}

export async function getAnimeTrackerUpcoming(days = 14): Promise<AnimeReleaseUpcoming[]> {
  const supabase = await createServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase.rpc("get_anime_tracker_upcoming", { p_days: days });
  if (error || !data) return [];

  return (data as UpcomingRow[]).map(mapUpcoming);
}

export async function getActiveAnimeReleaseClashes(): Promise<AnimeReleaseClash[]> {
  const supabase = await createServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase.rpc("get_active_anime_release_clashes");
  if (error || !data) return [];

  return (data as ClashRow[]).map(mapClash);
}

export async function getAnimeReleaseClashDetail(
  clashId: string,
): Promise<AnimeReleaseClashDetail | null> {
  const supabase = await createServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("get_anime_release_clash_detail", {
    p_clash_id: clashId,
  });

  if (error || !data?.[0]) return null;

  const row = data[0] as ClashRow;
  return { ...mapClash(row), clashStatus: row.clash_status ?? "active" };
}

export async function getAnimeReleaseClashVideos(
  clashId: string,
  limit = 24,
): Promise<Array<Video & { clashRank: number }>> {
  const supabase = await createServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase.rpc("get_anime_release_clash_videos", {
    p_clash_id: clashId,
    p_limit: limit,
  });

  if (error || !data?.length) return [];

  return attachChannels(supabase, data as Parameters<typeof attachChannels>[1]);
}
