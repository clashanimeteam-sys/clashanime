import { createServerClient } from "@/lib/supabase/server";

export type HallOfLegendsWinner = {
  seasonId: string;
  seasonName: string;
  seasonEndsAt: string;
  rank: number;
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  videoId: string | null;
  videoTitle: string | null;
  thumbnailUrl: string | null;
  prizeCents: number;
};

export type HallOfLegendsSeason = {
  seasonId: string;
  seasonName: string;
  seasonEndsAt: string;
  winners: HallOfLegendsWinner[];
};

export type AdminLegendSeason = {
  seasonId: string;
  seasonName: string;
  seasonStatus: "scheduled" | "active" | "ended";
  seasonStartsAt: string;
  seasonEndsAt: string;
  winnersCount: number;
};

export type AdminSeasonWinner = {
  id: string;
  seasonId: string;
  rank: number;
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  videoId: string | null;
  videoTitle: string | null;
  thumbnailUrl: string | null;
  prizeCents: number;
  trendingScore: number | null;
  finalizedAt: string;
};

type HallRow = {
  season_id: string;
  season_name: string;
  season_ends_at: string;
  rank: number;
  user_id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  video_id: string | null;
  video_title: string | null;
  thumbnail_url: string | null;
  prize_cents: number;
};

function mapHallRow(row: HallRow): HallOfLegendsWinner {
  return {
    seasonId: row.season_id,
    seasonName: row.season_name,
    seasonEndsAt: row.season_ends_at,
    rank: row.rank,
    userId: row.user_id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    videoId: row.video_id,
    videoTitle: row.video_title,
    thumbnailUrl: row.thumbnail_url,
    prizeCents: Number(row.prize_cents),
  };
}

export function groupHallOfLegends(rows: HallOfLegendsWinner[]): HallOfLegendsSeason[] {
  const seasonMap = new Map<string, HallOfLegendsSeason>();

  for (const row of rows) {
    const existing = seasonMap.get(row.seasonId);
    if (existing) {
      existing.winners.push(row);
      continue;
    }

    seasonMap.set(row.seasonId, {
      seasonId: row.seasonId,
      seasonName: row.seasonName,
      seasonEndsAt: row.seasonEndsAt,
      winners: [row],
    });
  }

  return [...seasonMap.values()];
}

export async function getHallOfLegends(seasonLimit = 6): Promise<HallOfLegendsSeason[]> {
  const supabase = await createServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase.rpc("get_hall_of_legends", {
    p_limit: seasonLimit,
  });

  if (error || !data?.length) {
    return [];
  }

  return groupHallOfLegends((data as HallRow[]).map(mapHallRow));
}
