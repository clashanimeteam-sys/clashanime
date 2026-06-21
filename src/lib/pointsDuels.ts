import type { SupabaseClient } from "@supabase/supabase-js";
import type { Video } from "@/lib/types";

export type PointsWagerDuelStatus = "pending" | "active" | "completed" | "cancelled";

export type PointsWagerDuelRow = {
  id: string;
  creator_id: string;
  opponent_id: string | null;
  opponent_username: string;
  creator_video_id: string;
  opponent_video_id: string | null;
  wager_points: number;
  status: PointsWagerDuelStatus;
  winner_id: string | null;
  created_at: string;
  accepted_at: string | null;
  resolved_at: string | null;
};

export type PointsWagerDuelRecord = PointsWagerDuelRow & {
  creatorVideo: Video;
  opponentVideo: Video | null;
  creatorUsername?: string;
  opponentDisplayName?: string;
};

type UserClipRow = {
  id: string;
  title: string;
  thumbnail_url: string;
};

export async function fetchUserApprovedClipsForWager(
  supabase: SupabaseClient | null,
  userId: string,
): Promise<UserClipRow[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("videos")
    .select("id, title, thumbnail_url")
    .eq("user_id", userId)
    .eq("moderation_status", "approved")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data) return [];
  return data as UserClipRow[];
}

export async function fetchOpenPointsWagerDuels(
  supabase: SupabaseClient | null,
  userId: string,
): Promise<PointsWagerDuelRow[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("points_wager_duels")
    .select("*")
    .or(`creator_id.eq.${userId},opponent_id.eq.${userId}`)
    .in("status", ["pending", "active"])
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data) return [];
  return data as PointsWagerDuelRow[];
}

export async function createPointsWagerDuel(
  supabase: SupabaseClient | null,
  opponentUsername: string,
  creatorVideoId: string,
  wagerPoints: number,
): Promise<{ duelId: string | null; error: string | null }> {
  if (!supabase) return { duelId: null, error: "offline" };

  const { data, error } = await supabase.rpc("create_points_wager_duel", {
    p_opponent_username: opponentUsername.trim(),
    p_creator_video_id: creatorVideoId,
    p_wager_points: wagerPoints,
  });

  if (error) return { duelId: null, error: error.message };
  return { duelId: data as string, error: null };
}

export async function acceptPointsWagerDuel(
  supabase: SupabaseClient | null,
  duelId: string,
  opponentVideoId: string,
): Promise<{ error: string | null }> {
  if (!supabase) return { error: "offline" };

  const { error } = await supabase.rpc("accept_points_wager_duel", {
    p_duel_id: duelId,
    p_opponent_video_id: opponentVideoId,
  });

  return { error: error?.message ?? null };
}

export async function resolvePointsWagerDuel(
  supabase: SupabaseClient | null,
  duelId: string,
): Promise<{ error: string | null }> {
  if (!supabase) return { error: "offline" };

  const { error } = await supabase.rpc("resolve_points_wager_duel", {
    p_duel_id: duelId,
  });

  return { error: error?.message ?? null };
}

export async function cancelPointsWagerDuel(
  supabase: SupabaseClient | null,
  duelId: string,
): Promise<{ error: string | null }> {
  if (!supabase) return { error: "offline" };

  const { error } = await supabase.rpc("cancel_points_wager_duel", {
    p_duel_id: duelId,
  });

  return { error: error?.message ?? null };
}

export type { UserClipRow };
