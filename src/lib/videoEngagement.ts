import type { SupabaseClient } from "@supabase/supabase-js";

export type VideoCounts = {
  likes_count: number;
  comments_count: number;
  shares_count: number;
  views_count: number;
};

export async function fetchVideoCounts(
  supabase: SupabaseClient,
  videoId: string,
): Promise<VideoCounts | null> {
  const { data, error } = await supabase
    .from("videos")
    .select("likes_count, comments_count, shares_count, views_count")
    .eq("id", videoId)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

export async function incrementVideoViews(
  supabase: SupabaseClient,
  videoId: string,
): Promise<boolean> {
  const storageKey = `clash-viewed-${videoId}`;

  if (typeof window !== "undefined" && sessionStorage.getItem(storageKey)) {
    return false;
  }

  const { error } = await supabase.rpc("increment_video_views", {
    target_video_id: videoId,
  });

  if (error) return false;

  if (typeof window !== "undefined") {
    sessionStorage.setItem(storageKey, "1");
  }

  return true;
}

export async function incrementVideoShares(
  supabase: SupabaseClient,
  videoId: string,
): Promise<number | null> {
  const { error } = await supabase.rpc("increment_video_shares", {
    target_video_id: videoId,
  });

  if (error) return null;

  const counts = await fetchVideoCounts(supabase, videoId);
  return counts?.shares_count ?? null;
}

export async function toggleVideoLike(
  supabase: SupabaseClient,
  videoId: string,
  userId: string,
  liked: boolean,
): Promise<VideoCounts | null> {
  if (liked) {
    const { error } = await supabase
      .from("video_likes")
      .delete()
      .eq("video_id", videoId)
      .eq("user_id", userId);

    if (error) return null;
  } else {
    const { error } = await supabase.from("video_likes").insert({
      video_id: videoId,
      user_id: userId,
    });

    if (error) return null;
  }

  return fetchVideoCounts(supabase, videoId);
}

export async function postVideoComment(
  supabase: SupabaseClient,
  videoId: string,
  userId: string,
  body: string,
): Promise<VideoCounts | null> {
  const trimmed = body.trim();
  if (!trimmed) return null;

  const { error } = await supabase.from("video_comments").insert({
    video_id: videoId,
    user_id: userId,
    body: trimmed,
  });

  if (error) return null;

  return fetchVideoCounts(supabase, videoId);
}

export async function checkVideoLiked(
  supabase: SupabaseClient,
  videoId: string,
  userId: string,
): Promise<boolean> {
  const { data } = await supabase
    .from("video_likes")
    .select("video_id")
    .eq("video_id", videoId)
    .eq("user_id", userId)
    .maybeSingle();

  return Boolean(data);
}
