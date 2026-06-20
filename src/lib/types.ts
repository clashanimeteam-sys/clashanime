export type Locale = "en" | "ja" | "ar";

export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

export type VideoChannel = {
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  follower_count?: number;
};

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
  user_id?: string | null;
  channel?: VideoChannel | null;
  hashtags?: string[];
  duration_seconds?: number | null;
  description?: string;
};

export const MIN_CLIP_SECONDS = 10;
export const MAX_CLIP_SECONDS = 60;
