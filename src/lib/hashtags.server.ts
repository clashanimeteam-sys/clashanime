import { normalizeHashtagSlug } from "@/lib/hashtagUrls";
import { createServerClient } from "@/lib/supabase/server";
import type { Video } from "@/lib/types";
import { attachVideoChannels } from "@/lib/videos";

export type HashtagPageStats = {
  tag: string;
  videoCount: number;
  channelCount: number;
};

export type TopHashtagRow = {
  tag: string;
  usageCount: number;
  channelCount: number;
};

export async function getHashtagPageStats(rawTag: string): Promise<HashtagPageStats | null> {
  const tag = normalizeHashtagSlug(rawTag);
  if (!tag) return null;

  const supabase = await createServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("get_hashtag_page_stats", { p_tag: tag });
  if (error || !data?.length) return null;

  const row = data[0] as { tag: string; video_count: number; channel_count: number };
  if (!row.tag) return null;

  return {
    tag: row.tag,
    videoCount: Number(row.video_count ?? 0),
    channelCount: Number(row.channel_count ?? 0),
  };
}

export async function getHashtagVideos(rawTag: string, limit = 48): Promise<Video[]> {
  const tag = normalizeHashtagSlug(rawTag);
  if (!tag) return [];

  const supabase = await createServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase.rpc("get_hashtag_videos", {
    p_tag: tag,
    p_limit: limit,
    p_offset: 0,
  });

  if (error || !data?.length) return [];

  return attachVideoChannels(
    supabase,
    data as Array<Omit<Video, "trending_score" | "channel"> & { user_id?: string | null }>,
  );
}

export async function listTopHashtags(limit = 20): Promise<TopHashtagRow[]> {
  const supabase = await createServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase.rpc("list_top_hashtags", { p_limit: limit });
  if (error || !data) return [];

  return (data as Array<{ tag: string; usage_count: number; channel_count: number }>).map((row) => ({
    tag: row.tag,
    usageCount: Number(row.usage_count ?? 0),
    channelCount: Number(row.channel_count ?? 0),
  }));
}
