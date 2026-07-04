"use client";

import { useEffect, useRef, useState } from "react";
import { getAdSenseClientId, isAdSenseEnabled, resolveAdSenseSlotId } from "@/lib/adsense";

type AdSenseUnitProps = {
  slot?: "banner" | "sidebar" | "infeed";
  slotId?: string;
  className?: string;
  format?: "auto" | "horizontal" | "rectangle" | "fluid";
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSenseUnit({
  slot = "banner",
  slotId: slotIdOverride,
  className = "",
  format = "auto",
}: AdSenseUnitProps) {
  const pushedRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const clientId = getAdSenseClientId();
  const slotId = resolveAdSenseSlotId(slot, slotIdOverride);
  const adsReady = Boolean(slotIdOverride?.trim() || isAdSenseEnabled());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !adsReady || !clientId || !slotId || pushedRef.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch {
      // Ad blocker may block push.
    }
  }, [adsReady, clientId, mounted, slotId]);

  if (!mounted || !adsReady || !clientId || !slotId) {
    return null;
  }

  return (
    <div className={`overflow-hidden ${className}`.trim()}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
