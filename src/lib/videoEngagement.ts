import type { SupabaseClient } from "@supabase/supabase-js";
import type { VideoComment, VideoCommentsData } from "@/lib/types";

export type VideoCounts = {
  likes_count: number;
  comments_count: number;
  shares_count: number;
  views_count: number;
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
  parentId?: string | null,
): Promise<VideoCounts | null> {
  const trimmed = body.trim();
  if (!trimmed) return null;

  const { error } = await supabase.from("video_comments").insert({
    video_id: videoId,
    user_id: userId,
    body: trimmed,
    parent_id: parentId ?? null,
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

export async function fetchVideoComments(
  supabase: SupabaseClient,
  videoId: string,
  currentUserId?: string | null,
): Promise<VideoCommentsData> {
  const [{ data: video }, { data: comments, error }] = await Promise.all([
    supabase.from("videos").select("user_id, pinned_comment_id").eq("id", videoId).maybeSingle(),
    supabase
      .from("video_comments")
      .select("id, body, created_at, user_id, parent_id, likes_count")
      .eq("video_id", videoId)
      .order("created_at", { ascending: true }),
  ]);

  if (error || !comments?.length) {
    return {
      videoOwnerId: video?.user_id ?? null,
      pinnedCommentId: video?.pinned_comment_id ?? null,
      comments: [],
    };
  }

  const commentIds = comments.map((comment) => comment.id);
  const userIds = [...new Set(comments.map((comment) => comment.user_id))];

  const [{ data: profiles }, { data: likedRows }] = await Promise.all([
    supabase.from("profiles").select("id, username, display_name, avatar_url, is_verified").in("id", userIds),
    currentUserId
      ? supabase
          .from("video_comment_likes")
          .select("comment_id")
          .eq("user_id", currentUserId)
          .in("comment_id", commentIds)
      : Promise.resolve({ data: [] as { comment_id: string }[] }),
  ]);

  const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
  const likedCommentIds = new Set((likedRows ?? []).map((row) => row.comment_id));

  return {
    videoOwnerId: video?.user_id ?? null,
    pinnedCommentId: video?.pinned_comment_id ?? null,
    comments: buildCommentTree(
      comments as RawComment[],
      profileMap,
      likedCommentIds,
      video?.pinned_comment_id ?? null,
    ),
  };
}

export async function toggleCommentLike(
  supabase: SupabaseClient,
  commentId: string,
  userId: string,
  liked: boolean,
): Promise<number | null> {
  if (liked) {
    const { error } = await supabase
      .from("video_comment_likes")
      .delete()
      .eq("comment_id", commentId)
      .eq("user_id", userId);

    if (error) return null;
  } else {
    const { error } = await supabase.from("video_comment_likes").insert({
      comment_id: commentId,
      user_id: userId,
    });

    if (error) return null;
  }

  const { data } = await supabase
    .from("video_comments")
    .select("likes_count")
    .eq("id", commentId)
    .maybeSingle();

  return data?.likes_count ?? null;
}

export async function pinVideoComment(
  supabase: SupabaseClient,
  videoId: string,
  commentId: string,
  ownerId: string,
): Promise<string | null> {
  const { data: comment } = await supabase
    .from("video_comments")
    .select("id, video_id, user_id, parent_id")
    .eq("id", commentId)
    .maybeSingle();

  if (
    !comment ||
    comment.video_id !== videoId ||
    comment.user_id !== ownerId ||
    comment.parent_id
  ) {
    return null;
  }

  const { error } = await supabase
    .from("videos")
    .update({ pinned_comment_id: commentId })
    .eq("id", videoId)
    .eq("user_id", ownerId);

  if (error) return null;
  return commentId;
}

export async function unpinVideoComment(
  supabase: SupabaseClient,
  videoId: string,
  ownerId: string,
): Promise<boolean> {
  const { error } = await supabase
    .from("videos")
    .update({ pinned_comment_id: null })
    .eq("id", videoId)
    .eq("user_id", ownerId);

  return !error;
}
