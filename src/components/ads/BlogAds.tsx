"use client";

import { AdSenseUnit } from "@/components/ads/AdSenseUnit";
import { AdPlacementBanner } from "@/components/ads/AdPlacementBanner";
import { isAdSenseEnabled, isAdSenseScriptReady } from "@/lib/adsense";

type BlogAdsProps = {
  className?: string;
  /** Mid-page in-feed AdSense unit. */
  variant?: "top" | "mid";
};

/**
 * Google AdSense placements for /blog (clashanime.com).
 * Fills after AdSense site status is Ready + Auto ads and/or ad unit slots.
 */
export function BlogAds({ className = "", variant = "top" }: BlogAdsProps) {
  const adsenseUnits = isAdSenseEnabled();
  const adsenseReady = isAdSenseScriptReady();

  if (variant === "mid") {
    if (!adsenseUnits) return null;
    return (
      <div className={`my-10 flex justify-center ${className}`.trim()} aria-label="Advertisement">
        <AdSenseUnit slot="infeed" format="fluid" className="min-h-[120px] w-full max-w-2xl" />
      </div>
    );
  }

  if (!adsenseReady) return null;

  return (
    <div
      className={`flex flex-col items-center gap-4 py-4 ${className}`.trim()}
      aria-label="Advertisement"
    >
      {adsenseUnits ? (
        <AdSenseUnit slot="banner" format="horizontal" className="min-h-[90px] w-full max-w-3xl" />
      ) : (
        <AdPlacementBanner page="blog" className="w-full max-w-3xl" />
      )}
    </div>
  );
}
