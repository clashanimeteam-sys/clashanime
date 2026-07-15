/** HilltopAds zone #7226325 — Popunder anti-AdBlock (clashanime.com). */
const DEFAULT_ANTI_ADBLOCK_SRC = "/ads/hilltop-antiadblock.js";

export function isHilltopAdsEnabled() {
  return process.env.NEXT_PUBLIC_HILLTOPADS_ENABLED !== "false";
}

export function getHilltopAdsPopunderUrl() {
  const raw =
    process.env.NEXT_PUBLIC_HILLTOPADS_POPUNDER_URL?.trim() || DEFAULT_ANTI_ADBLOCK_SRC;
  if (raw.startsWith("//")) return `https:${raw}`;
  return raw;
}
