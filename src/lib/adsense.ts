/**
 * AdSense is disabled on clashanime.com (removed by request).
 * Re-enable only with NEXT_PUBLIC_ADSENSE_ENABLED=true + client/slot env vars.
 */

export function getAdSenseClientId() {
  if (process.env.NEXT_PUBLIC_ADSENSE_ENABLED !== "true") return "";
  return process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim() || "";
}

export function getAdSenseSlotId(variant: "banner" | "sidebar" | "infeed" = "banner") {
  if (process.env.NEXT_PUBLIC_ADSENSE_ENABLED !== "true") return null;
  if (variant === "infeed") {
    return (
      process.env.NEXT_PUBLIC_ADSENSE_SLOT_INFEED?.trim() ||
      process.env.NEXT_PUBLIC_ADSENSE_SLOT?.trim() ||
      null
    );
  }
  if (variant === "sidebar") {
    return (
      process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR?.trim() ||
      process.env.NEXT_PUBLIC_ADSENSE_SLOT?.trim() ||
      null
    );
  }
  return process.env.NEXT_PUBLIC_ADSENSE_SLOT?.trim() || null;
}

export function resolveAdSenseSlotId(
  variant: "banner" | "sidebar" | "infeed",
  override?: string | null,
): string | null {
  if (process.env.NEXT_PUBLIC_ADSENSE_ENABLED !== "true") return null;
  const trimmed = override?.trim();
  if (trimmed) return trimmed;
  return getAdSenseSlotId(variant);
}

export function isAdSenseScriptReady() {
  return Boolean(getAdSenseClientId());
}

/** Manual ad units — needs explicit enable + client + slot. */
export function isAdSenseEnabled() {
  return Boolean(getAdSenseClientId() && getAdSenseSlotId());
}

export function isAdSenseAutoAdsPreferred() {
  return process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true" && Boolean(getAdSenseClientId());
}

export function getAdSenseScriptUrl(clientId: string) {
  return `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`;
}
