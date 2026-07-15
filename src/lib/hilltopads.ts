/** HilltopAds zone #7226325 — Popunder (clashanime.com). */
const DEFAULT_POPUNDER_SRC =
  "https://funny-tooth.com/cND.9/6Hb/2U5Pl-SAWCQb9INyzyIWyMNfj_MTyrNqS/0/3/M/jvI-2/MCzUID5A";

export function isHilltopAdsEnabled() {
  return process.env.NEXT_PUBLIC_HILLTOPADS_ENABLED !== "false";
}

export function getHilltopAdsPopunderUrl() {
  const raw = process.env.NEXT_PUBLIC_HILLTOPADS_POPUNDER_URL?.trim() || DEFAULT_POPUNDER_SRC;
  if (raw.startsWith("//")) return `https:${raw}`;
  return raw;
}
