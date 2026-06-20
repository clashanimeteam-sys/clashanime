import type { SupabaseClient } from "@supabase/supabase-js";
import type { VideoComment } from "@/lib/types";

export type CommunityReaction = "like" | "dislike";

export type CommunityPostCounts = {
  likes_count: number;
  dislikes_count: number;
  comments_count: number;
  shares_count: number;
};

export type CommunityCommentsData = {
  postOwnerId: string | null;
  pinnedCommentId: string | null;
  comments: VideoComment[];
};

export type CommunityPostDetail = {
  id: string;
  body: string | null;
  image_url: string | null;
  created_at: string;
  user_id: string;
  likes_count: number;
  dislikes_count: number;
  comments_count: number;
  shares_count: number;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  is_verified?: boolean;
  level?: number;
  points?: number;
};

type RawComment = {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  parent_id: string | null;
  likes_count: number;
};

function buildCommentTree(
  rows: RawComment[],
  profiles: Map<
    string,
    {
      username: string;
      display_name: string | null;
      avatar_url: string | null;
      is_verified?: boolean;
    }
  >,
  likedCommentIds: Set<string>,
  pinnedCommentId: string | null,
): VideoComment[] {
  const map = new Map<string, VideoComment>();

  for (const row of rows) {
    const profile = profiles.get(row.user_id);
    map.set(row.id, {
      id: row.id,
      body: row.body,
      created_at: row.created_at,
      user_id: row.user_id,
      username: profile?.username ?? "user",
      display_name: profile?.display_name ?? null,
      avatar_url: profile?.avatar_url ?? null,
      is_verified: profile?.is_verified,
      parent_id: row.parent_id,
      likes_count: row.likes_count,
      liked_by_me: likedCommentIds.has(row.id),
      replies: [],
    });
  }

  const roots: VideoComment[] = [];

  for (const comment of map.values()) {
    if (comment.parent_id && map.has(comment.parent_id)) {
      map.get(comment.parent_id)?.replies.push(comment);
    } else if (!comment.parent_id) {
      roots.push(comment);
    }
  }

  for (const comment of map.values()) {
    comment.replies.sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
  }

  roots.sort((a, b) => {
    if (a.id === pinnedCommentId) return -1;
    if (b.id === pinnedCommentId) return 1;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  return roots;
}

export async function fetchCommunityPost(
  supabase: SupabaseClient,
  postId: string,
): Promise<CommunityPostDetail | null> {
  const { data, error } = await supabase
    .from("community_posts")
    .select(
      "id, body, image_url, created_at, user_id, likes_count, dislikes_count, comments_count, shares_count",
    )
    .eq("id", postId)
    .maybeSingle();

  if (error || !data) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, avatar_url, is_verified, level, points")
    .eq("id", data.user_id)
    .maybeSingle();

  return {
    ...data,
    body: data.body ?? null,
    image_url: data.image_url ?? null,
    likes_count: data.likes_count ?? 0,
    dislikes_count: data.dislikes_count ?? 0,
    comments_count: data.comments_count ?? 0,
    shares_count: data.shares_count ?? 0,
    username: profile?.username ?? "user",
    display_name: profile?.display_name ?? null,
    avatar_url: profile?.avatar_url ?? null,
    is_verified: profile?.is_verified,
    level: profile?.level,
    points: profile?.points,
  };
}

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
  currentUserId?: string | null,
): Promise<CommunityCommentsData> {
  const [{ data: post }, { data: comments, error }] = await Promise.all([
    supabase.from("community_posts").select("user_id, pinned_comment_id").eq("id", postId).maybeSingle(),
    supabase
      .from("community_post_comments")
      .select("id, body, created_at, user_id, parent_id, likes_count")
      .eq("post_id", postId)
      .order("created_at", { ascending: true }),
  ]);

  if (error || !comments?.length) {
    return {
      postOwnerId: post?.user_id ?? null,
      pinnedCommentId: post?.pinned_comment_id ?? null,
      comments: [],
    };
  }

  const commentIds = comments.map((comment) => comment.id);
  const userIds = [...new Set(comments.map((comment) => comment.user_id))];

  const [{ data: profiles }, { data: likedRows }] = await Promise.all([
    supabase.from("profiles").select("id, username, display_name, avatar_url, is_verified").in("id", userIds),
    currentUserId
      ? supabase
          .from("community_post_comment_likes")
          .select("comment_id")
          .eq("user_id", currentUserId)
          .in("comment_id", commentIds)
      : Promise.resolve({ data: [] as { comment_id: string }[] }),
  ]);

  const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
  const likedCommentIds = new Set((likedRows ?? []).map((row) => row.comment_id));

  return {
    postOwnerId: post?.user_id ?? null,
    pinnedCommentId: post?.pinned_comment_id ?? null,
    comments: buildCommentTree(
      comments as RawComment[],
      profileMap,
      likedCommentIds,
      post?.pinned_comment_id ?? null,
    ),
  };
}

export async function postCommunityComment(
  supabase: SupabaseClient,
  postId: string,
  userId: string,
  body: string,
  parentId?: string | null,
): Promise<CommunityPostCounts | null> {
  const trimmed = body.trim();
  if (!trimmed) return null;

  const { error } = await supabase.from("community_post_comments").insert({
    post_id: postId,
    user_id: userId,
    body: trimmed,
    parent_id: parentId ?? null,
  });

  if (error) return null;
  return fetchCommunityPostCounts(supabase, postId);
}

export async function toggleCommunityCommentLike(
  supabase: SupabaseClient,
  commentId: string,
  userId: string,
  liked: boolean,
): Promise<number | null> {
  if (liked) {
    const { error } = await supabase
      .from("community_post_comment_likes")
      .delete()
      .eq("comment_id", commentId)
      .eq("user_id", userId);

    if (error) return null;
  } else {
    const { error } = await supabase.from("community_post_comment_likes").insert({
      comment_id: commentId,
      user_id: userId,
    });

    if (error) return null;
  }

  const { data } = await supabase
    .from("community_post_comments")
    .select("likes_count")
    .eq("id", commentId)
    .maybeSingle();

  return data?.likes_count ?? null;
}

export async function pinCommunityComment(
  supabase: SupabaseClient,
  postId: string,
  commentId: string,
  ownerId: string,
): Promise<string | null> {
  const { data: comment } = await supabase
    .from("community_post_comments")
    .select("id, post_id, user_id, parent_id")
    .eq("id", commentId)
    .maybeSingle();

  if (
    !comment ||
    comment.post_id !== postId ||
    comment.user_id !== ownerId ||
    comment.parent_id
  ) {
    return null;
  }

  const { error } = await supabase
    .from("community_posts")
    .update({ pinned_comment_id: commentId })
    .eq("id", postId)
    .eq("user_id", ownerId);

  if (error) return null;
  return commentId;
}

export async function unpinCommunityComment(
  supabase: SupabaseClient,
  postId: string,
  ownerId: string,
): Promise<boolean> {
  const { error } = await supabase
    .from("community_posts")
    .update({ pinned_comment_id: null })
    .eq("id", postId)
    .eq("user_id", ownerId);

  return !error;
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
