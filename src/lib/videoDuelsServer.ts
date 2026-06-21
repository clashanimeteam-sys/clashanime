import { createServerClient } from "@/lib/supabase/server";
import { getVideoById } from "@/lib/videos";
import type { Video } from "@/lib/types";

export type VideoDuelRecord = {
  id: string;
  challengedVideo: Video;
  challengerVideo: Video;
  created_at: string;
};

export async function getVideoDuelById(id: string): Promise<VideoDuelRecord | null> {
  const supabase = await createServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("video_duels")
    .select("id, challenged_video_id, challenger_video_id, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  const [challengedVideo, challengerVideo] = await Promise.all([
    getVideoById(data.challenged_video_id),
    getVideoById(data.challenger_video_id),
  ]);

  if (!challengedVideo || !challengerVideo) return null;

  return {
    id: data.id,
    challengedVideo,
    challengerVideo,
    created_at: data.created_at,
  };
}
