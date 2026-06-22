export type Locale = "en" | "ja" | "ar";

export type UserRole = "user" | "moderator" | "admin";

export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  bio: string | null;
  role?: UserRole;
  is_banned?: boolean;
  is_verified?: boolean;
  points?: number;
  clash_coins?: number;
  level?: number;
  referred_by?: string | null;
  display_name_changed_at?: string | null;
  username_changed_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type VideoChannel = {
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  follower_count?: number;
  is_verified?: boolean;
  level?: number;
  points?: number;
};

export type VideoComment = {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  parent_id: string | null;
  likes_count: number;
  liked_by_me: boolean;
  is_verified?: boolean;
  replies: VideoComment[];
};

export type VideoCommentsData = {
  videoOwnerId: string | null;
  pinnedCommentId: string | null;
  comments: VideoComment[];
};

export type ModerationStatus = "pending" | "approved" | "rejected" | "review";

export type Video = {
  id: string;
  title: string;
  thumbnail_url: string;
  video_url: string;
  likes_count: number;
  comments_count: number;
  views_count?: number;
  shares_count?: number;
  created_at: string;
  trending_score: number;
  global_rank?: number;
  user_id?: string | null;
  channel?: VideoChannel | null;
  hashtags?: string[];
  duration_seconds?: number | null;
  description?: string;
  moderation_status?: ModerationStatus;
  rejection_reason?: string | null;
  suspicion_score?: number;
  suspicion_flags?: string[];
};

export const MIN_CLIP_SECONDS = 10;
export const MAX_CLIP_SECONDS = 60;
