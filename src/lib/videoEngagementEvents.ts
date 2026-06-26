export type VideoEngagementDelta = {
  videoId: string;
  likes_count?: number;
  comments_count?: number;
  shares_count?: number;
  views_count?: number;
};

export const VIDEO_ENGAGEMENT_CHANGED = "clashanime:video-engagement-changed";

export function dispatchVideoEngagementChanged(delta: VideoEngagementDelta) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<VideoEngagementDelta>(VIDEO_ENGAGEMENT_CHANGED, { detail: delta }));
}
