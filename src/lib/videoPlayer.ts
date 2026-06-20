export const PUBLIC_VIDEO_CONTROLS_LIST = "nodownload" as const;

export function blockPublicVideoContextMenu(event: { preventDefault: () => void }) {
  event.preventDefault();
}
