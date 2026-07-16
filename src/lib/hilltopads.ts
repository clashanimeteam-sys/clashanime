/** HilltopAds — clashanime.com */

const DEFAULT_ANTI_ADBLOCK_SRC = "/ads/hilltop-antiadblock.js";

function normalizeHilltopScriptUrl(raw: string) {
  if (raw.startsWith("//")) return `https:${raw}`;
  return raw;
}

export function isHilltopAdsEnabled() {
  return process.env.NEXT_PUBLIC_HILLTOPADS_ENABLED !== "false";
}

/** Zone #7226325 — Popunder anti-AdBlock (hosted locally). */
export function getHilltopAdsPopunderUrl() {
  const raw =
    process.env.NEXT_PUBLIC_HILLTOPADS_POPUNDER_URL?.trim() || DEFAULT_ANTI_ADBLOCK_SRC;
  return normalizeHilltopScriptUrl(raw);
}

/**
 * MultiTag Banner 300×250 for /blog.
 * Set NEXT_PUBLIC_HILLTOPADS_BANNER_URL to the script from Hilltop (clashanime.com site).
 */
export function getHilltopAdsBannerUrl() {
  const raw = process.env.NEXT_PUBLIC_HILLTOPADS_BANNER_URL?.trim() ?? "";
  if (!raw) return "";
  return normalizeHilltopScriptUrl(raw);
}

/**
 * MultiTag Video Slider for /blog.
 * Set NEXT_PUBLIC_HILLTOPADS_VIDEO_SLIDER_URL from Hilltop (clashanime.com site).
 */
export function getHilltopAdsVideoSliderUrl() {
  const raw = process.env.NEXT_PUBLIC_HILLTOPADS_VIDEO_SLIDER_URL?.trim() ?? "";
  if (!raw) return "";
  return normalizeHilltopScriptUrl(raw);
}
