import type { SupabaseClient } from "@supabase/supabase-js";
import { parseHashtags } from "@/lib/upload";
import type { Video } from "@/lib/types";

export type UpdateOwnVideoInput = {
  title: string;
  hashtagsText: string;
};

export async function updateOwnVideo(
  supabase: SupabaseClient,
  videoId: string,
  input: UpdateOwnVideoInput,
): Promise<{ video: Video | null; error: string | null }> {
  const title = input.title.trim();
  if (!title) {
    return { video: null, error: "title required" };
  }

  const tags = parseHashtags(input.hashtagsText);

  const { data, error } = await supabase.rpc("update_own_video", {
    p_video_id: videoId,
    p_title: title,
    p_hashtags: tags,
  });

  if (error) {
    return { video: null, error: error.message };
  }

  return { video: (data as Video | null) ?? null, error: null };
}

export async function deleteOwnVideo(
  supabase: SupabaseClient,
  videoId: string,
): Promise<{ ok: boolean; error: string | null }> {
  const { error } = await supabase.rpc("delete_own_video", {
    p_video_id: videoId,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, error: null };
}
