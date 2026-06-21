import { createServerClient } from "@/lib/supabase/server";
import { getVideoById } from "@/lib/videos";
import type { PointsWagerDuelRecord, PointsWagerDuelRow } from "@/lib/pointsDuels";

export async function getPointsWagerDuelById(id: string): Promise<PointsWagerDuelRecord | null> {
  const supabase = await createServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("points_wager_duels")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as PointsWagerDuelRow;
  const [creatorVideo, opponentVideo] = await Promise.all([
    getVideoById(row.creator_video_id),
    row.opponent_video_id ? getVideoById(row.opponent_video_id) : Promise.resolve(null),
  ]);

  if (!creatorVideo) return null;

  const profileIds = [row.creator_id, row.opponent_id].filter(Boolean) as string[];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, display_name")
    .in("id", profileIds);

  const creatorProfile = profiles?.find((p) => p.id === row.creator_id);
  const opponentProfile = profiles?.find((p) => p.id === row.opponent_id);

  return {
    ...row,
    creatorVideo,
    opponentVideo,
    creatorUsername: creatorProfile?.username,
    opponentDisplayName: opponentProfile?.display_name ?? opponentProfile?.username,
  };
}

export async function getRecentPointsWagerDuels(limit = 12): Promise<PointsWagerDuelRow[]> {
  const supabase = await createServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("points_wager_duels")
    .select("*")
    .in("status", ["pending", "active"])
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data as PointsWagerDuelRow[];
}
