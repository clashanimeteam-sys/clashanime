/**
 * HilltopAds helpers for clashanime.com.
 * Kept OFF by default — Google AdSense policy: do not mix Hilltop popunders
 * (or other ad networks) on the same AdSense property.
 * Only enable on a non-AdSense property if you explicitly set the env flag.
 */

const DEFAULT_ANTI_ADBLOCK_SRC = "/ads/hilltop-antiadblock.js";

function normalizeHilltopScriptUrl(raw: string) {
  if (raw.startsWith("//")) return `https:${raw}`;
  return raw;
}

/** Must be explicitly `"true"` — off by default for AdSense compliance. */
export function isHilltopAdsEnabled() {
  return process.env.NEXT_PUBLIC_HILLTOPADS_ENABLED === "true";
}

/** Zone #7226325 — Popunder anti-AdBlock (hosted locally). Unused while Hilltop is off. */
export function getHilltopAdsPopunderUrl() {
  const raw =
    process.env.NEXT_PUBLIC_HILLTOPADS_POPUNDER_URL?.trim() || DEFAULT_ANTI_ADBLOCK_SRC;
  return normalizeHilltopScriptUrl(raw);
}

export function getHilltopAdsBannerUrl() {
  const raw = process.env.NEXT_PUBLIC_HILLTOPADS_BANNER_URL?.trim() ?? "";
  if (!raw) return "";
  return normalizeHilltopScriptUrl(raw);
}

export function getHilltopAdsVideoSliderUrl() {
  const raw = process.env.NEXT_PUBLIC_HILLTOPADS_VIDEO_SLIDER_URL?.trim() ?? "";
  if (!raw) return "";
  return normalizeHilltopScriptUrl(raw);
}
