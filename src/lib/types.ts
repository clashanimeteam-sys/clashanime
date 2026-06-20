export type Locale = "en" | "ja" | "ar";

export type Video = {
  id: string;
  title: string;
  thumbnail_url: string;
  video_url: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  trending_score: number;
};
