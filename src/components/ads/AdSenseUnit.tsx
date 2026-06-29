"use client";

import { useEffect, useRef, useState } from "react";
import { getAdSenseClientId, getAdSenseSlotId, isAdSenseEnabled } from "@/lib/adsense";

type AdSenseUnitProps = {
  slot?: "banner" | "sidebar";
  className?: string;
  format?: "auto" | "horizontal" | "rectangle";
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSenseUnit({
  slot = "banner",
  className = "",
  format = "auto",
}: AdSenseUnitProps) {
  const pushedRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const clientId = getAdSenseClientId();
  const slotId = getAdSenseSlotId(slot);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isAdSenseEnabled() || !clientId || !slotId || pushedRef.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch {
      // Ad blocker may block push — anti-adblock guard handles that separately.
    }
  }, [clientId, mounted, slotId]);

  if (!mounted || !isAdSenseEnabled() || !clientId || !slotId) {
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
