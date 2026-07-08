const ADSENSE_CLIENT_ID = "ca-pub-9998186124580672";

export function getAdSenseClientId() {
  return process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim() || ADSENSE_CLIENT_ID;
}

export function getAdSenseSlotId(variant: "banner" | "sidebar" | "infeed" = "banner") {
  if (variant === "infeed") {
    return (
      process.env.NEXT_PUBLIC_ADSENSE_SLOT_INFEED?.trim() ||
      process.env.NEXT_PUBLIC_ADSENSE_SLOT?.trim() ||
      null
    );
  }
  if (variant === "sidebar") {
    return process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR?.trim() || process.env.NEXT_PUBLIC_ADSENSE_SLOT?.trim() || null;
  }
  return process.env.NEXT_PUBLIC_ADSENSE_SLOT?.trim() || null;
}

export function resolveAdSenseSlotId(
  variant: "banner" | "sidebar" | "infeed",
  override?: string | null,
): string | null {
  const trimmed = override?.trim();
  if (trimmed) return trimmed;
  return getAdSenseSlotId(variant);
}

export function isAdSenseScriptReady() {
  return Boolean(getAdSenseClientId());
}

export function isAdSenseEnabled() {
  return Boolean(getAdSenseClientId() && getAdSenseSlotId());
}

export function getAdSenseScriptUrl(clientId: string) {
  return `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`;
}
