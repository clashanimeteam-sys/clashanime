import type { SupabaseClient } from "@supabase/supabase-js";

export type CommunityReaction = "like" | "dislike";

export type CommunityPostCounts = {
  likes_count: number;
  dislikes_count: number;
  comments_count: number;
  shares_count: number;
};

export type CommunityComment = {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  is_verified?: boolean;
};

export async function fetchCommunityPostCounts(
  supabase: SupabaseClient,
  postId: string,
): Promise<CommunityPostCounts | null> {
  const { data, error } = await supabase
    .from("community_posts")
    .select("likes_count, dislikes_count, comments_count, shares_count")
    .eq("id", postId)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

export async function fetchCommunityReaction(
  supabase: SupabaseClient,
  postId: string,
  userId: string,
): Promise<CommunityReaction | null> {
  const { data } = await supabase
    .from("community_post_reactions")
    .select("reaction")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!data?.reaction) return null;
  return data.reaction as CommunityReaction;
}

export async function setCommunityReaction(
  supabase: SupabaseClient,
  postId: string,
  userId: string,
  reaction: CommunityReaction | null,
  currentReaction: CommunityReaction | null,
): Promise<CommunityPostCounts | null> {
  if (reaction === currentReaction) {
    const { error } = await supabase
      .from("community_post_reactions")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);

    if (error) return null;
  } else if (currentReaction) {
    const { error } = await supabase
      .from("community_post_reactions")
      .update({ reaction })
      .eq("post_id", postId)
      .eq("user_id", userId);

    if (error) return null;
  } else if (reaction) {
    const { error } = await supabase.from("community_post_reactions").insert({
      post_id: postId,
      user_id: userId,
      reaction,
    });

    if (error) return null;
  }

  return fetchCommunityPostCounts(supabase, postId);
}

export async function incrementCommunityPostShares(
  supabase: SupabaseClient,
  postId: string,
): Promise<number | null> {
  const { error } = await supabase.rpc("increment_community_post_shares", {
    target_post_id: postId,
  });

  if (error) return null;

  const counts = await fetchCommunityPostCounts(supabase, postId);
  return counts?.shares_count ?? null;
}

export async function fetchCommunityComments(
  supabase: SupabaseClient,
  postId: string,
): Promise<CommunityComment[]> {
  const { data: comments, error } = await supabase
    .from("community_post_comments")
    .select("id, body, created_at, user_id")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error || !comments?.length) return [];

  const userIds = [...new Set(comments.map((comment) => comment.user_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, is_verified")
    .in("id", userIds);

  const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

  return comments.map((comment) => {
    const profile = profileMap.get(comment.user_id);
    return {
      id: comment.id,
      body: comment.body,
      created_at: comment.created_at,
      user_id: comment.user_id,
      username: profile?.username ?? "user",
      display_name: profile?.display_name ?? null,
      avatar_url: profile?.avatar_url ?? null,
      is_verified: profile?.is_verified,
    };
  });
}

export async function postCommunityComment(
  supabase: SupabaseClient,
  postId: string,
  userId: string,
  body: string,
): Promise<CommunityPostCounts | null> {
  const trimmed = body.trim();
  if (!trimmed) return null;

  const { error } = await supabase.from("community_post_comments").insert({
    post_id: postId,
    user_id: userId,
    body: trimmed,
  });

  if (error) return null;
  return fetchCommunityPostCounts(supabase, postId);
}

export async function deleteCommunityComment(
  supabase: SupabaseClient,
  commentId: string,
): Promise<boolean> {
  const { error } = await supabase.from("community_post_comments").delete().eq("id", commentId);
  return !error;
}

export async function deleteCommunityPost(
  supabase: SupabaseClient,
  postId: string,
): Promise<boolean> {
  const { error } = await supabase.from("community_posts").delete().eq("id", postId);
  return !error;
}
