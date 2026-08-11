"use client";

import { AdSenseUnit } from "@/components/ads/AdSenseUnit";
import { AdPlacementBanner } from "@/components/ads/AdPlacementBanner";
import { isAdSenseEnabled, isAdSenseScriptReady } from "@/lib/adsense";

type BlogAdsProps = {
  className?: string;
  /**
   * top / bottom — horizontal banner
   * mid / between — in-feed fluid
   * rectangle — 300×250-style block
   */
  variant?: "top" | "mid" | "bottom" | "between" | "rectangle";
};

/**
 * Google AdSense placements for Heroes Guide (/blog on clashanime.com).
 * Hilltop is intentionally disabled on this property (AdSense compliance).
 */
export function BlogAds({ className = "", variant = "top" }: BlogAdsProps) {
  const adsenseUnits = isAdSenseEnabled();
  const adsenseReady = isAdSenseScriptReady();

  if (!adsenseReady && !adsenseUnits) return null;

  if (variant === "mid" || variant === "between") {
    return (
      <div
        className={`my-8 flex justify-center sm:my-10 ${className}`.trim()}
        aria-label="Advertisement"
      >
        {adsenseUnits ? (
          <AdSenseUnit slot="infeed" format="fluid" className="min-h-[120px] w-full max-w-2xl" />
        ) : (
          <AdPlacementBanner page="blog" className="w-full max-w-2xl" />
        )}
      </div>
    );
  }

  if (variant === "rectangle") {
    return (
      <div
        className={`my-6 flex justify-center ${className}`.trim()}
        aria-label="Advertisement"
      >
        {adsenseUnits ? (
          <AdSenseUnit
            slot="sidebar"
            format="rectangle"
            className="min-h-[250px] w-full max-w-[300px]"
          />
        ) : (
          <AdPlacementBanner page="blog" className="w-full max-w-[300px]" />
        )}
      </div>
    );
  }

  // top / bottom
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
