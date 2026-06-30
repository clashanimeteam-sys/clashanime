"use client";

import Script from "next/script";
import { getAdSenseClientId, getAdSenseScriptUrl, isAdSenseScriptReady } from "@/lib/adsense";

export function AdSenseScript() {
  const clientId = getAdSenseClientId();
  if (!isAdSenseScriptReady() || !clientId) return null;

  return (
    <Script
      id="adsbygoogle-init"
      async
      crossOrigin="anonymous"
      src={getAdSenseScriptUrl(clientId)}
      strategy="afterInteractive"
    />
  );
}
