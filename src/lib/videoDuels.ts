import type { SupabaseClient } from "@supabase/supabase-js";

type UserClipRow = {
  id: string;
  title: string;
  thumbnail_url: string;
  video_url: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
};

export async function fetchUserApprovedClips(
  supabase: SupabaseClient | null,
  userId: string,
): Promise<UserClipRow[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("videos")
    .select("id, title, thumbnail_url, video_url, likes_count, comments_count, created_at")
    .eq("user_id", userId)
    .eq("moderation_status", "approved")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data) return [];
  return data as UserClipRow[];
}

export async function createVideoDuel(
  supabase: SupabaseClient | null,
  challengedVideoId: string,
  challengerVideoId: string,
): Promise<{ duelId: string | null; error: string | null }> {
  if (!supabase) {
    return { duelId: null, error: "offline" };
  }

  const { data, error } = await supabase.rpc("create_video_duel", {
    p_challenged_video_id: challengedVideoId,
    p_challenger_video_id: challengerVideoId,
  });

  if (error) {
    return { duelId: null, error: error.message };
  }

  return { duelId: data as string, error: null };
}

export type { UserClipRow };
