export const PUBLIC_VIDEO_CONTROLS_LIST = "nodownload" as const;
export const PUBLIC_VIDEO_PLAYER_CLASS = "public-video-player" as const;
export const SHORTS_PROGRESS_CLASS = "shorts-progress" as const;

export function formatVideoTimestamp(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  const remainder = total % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

export function blockPublicVideoContextMenu(event: { preventDefault: () => void }) {
  event.preventDefault();
}
