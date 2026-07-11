"use client";

import { useEffect, useId, useRef } from "react";

const MASTER_SPOT_SDK = "https://cdn.tsyndicate.com/sdk/v1/master.spot.js";

declare global {
  interface Window {
    TsMasterSpot?: (config: Record<string, unknown>) => void;
  }
}

function loadMasterSpotSdk() {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.TsMasterSpot) return Promise.resolve();

  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${MASTER_SPOT_SDK}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = MASTER_SPOT_SDK;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("TrafficStars SDK failed"));
    document.head.appendChild(script);
  });
}

type TrafficStarsBannerProps = {
  spotId: string;
  className?: string;
};

export function TrafficStarsBanner({ spotId, className = "" }: TrafficStarsBannerProps) {
  const reactId = useId();
  const containerId = `ts-banner-${reactId.replace(/:/g, "")}`;
  const initialized = useRef(false);

  useEffect(() => {
    const spot = spotId.trim();
    if (!spot || initialized.current) return;
    initialized.current = true;

    loadMasterSpotSdk()
      .then(() => {
        window.TsMasterSpot?.({
          spot,
          containerId,
        });
      })
      .catch(() => {
        initialized.current = false;
      });
  }, [containerId, spotId]);

  if (!spotId.trim()) return null;

  return (
    <div
      id={containerId}
      className={`flex min-h-[90px] w-full items-center justify-center overflow-hidden ${className}`.trim()}
      data-trafficstars-banner={spotId}
    />
  );
}
