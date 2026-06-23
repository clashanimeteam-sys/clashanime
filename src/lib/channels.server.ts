import { createServerClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export type PublicChannelProfile = {
  profile: Profile;
  followerCount: number;
  videoCount: number;
  communityPostCount: number;
};

export async function getPublicChannelByUsername(
  username: string,
): Promise<PublicChannelProfile | null> {
  const supabase = await createServerClient();
  if (!supabase) return null;

  const normalizedUsername = username.replace(/^@/, "").toLowerCase();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", normalizedUsername)
    .maybeSingle();

  if (error || !profile) return null;

  const [{ count: followerCount }, { count: videoCount }, { count: communityPostCount }] =
    await Promise.all([
      supabase
        .from("channel_follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", profile.id),
      supabase
        .from("videos")
        .select("*", { count: "exact", head: true })
        .eq("user_id", profile.id)
        .eq("moderation_status", "approved"),
      supabase
        .from("community_posts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", profile.id),
    ]);

  return {
    profile: profile as Profile,
    followerCount: followerCount ?? 0,
    videoCount: videoCount ?? 0,
    communityPostCount: communityPostCount ?? 0,
  };
}
