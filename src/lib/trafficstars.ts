/** TrafficStars publisher config — banner spot ID + popunder script URL from dashboard. */

export function getTrafficStarsBannerSpot() {
  return process.env.NEXT_PUBLIC_TRAFFICSTARS_BANNER_SPOT?.trim() ?? "";
}

export function getTrafficStarsPopunderUrl() {
  const raw = process.env.NEXT_PUBLIC_TRAFFICSTARS_POPUNDER_URL?.trim() ?? "";
  if (!raw) return "";
  if (raw.startsWith("//")) return `https:${raw}`;
  return raw;
}

export function normalizeTrafficStarsScriptUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  return trimmed;
}
