"use client";

import { AdSenseUnit } from "@/components/ads/AdSenseUnit";
import { AdPlacementBanner } from "@/components/ads/AdPlacementBanner";
import { HilltopAdsBanner } from "@/components/ads/HilltopAdsBanner";
import { HilltopAdsVideoSlider } from "@/components/ads/HilltopAdsVideoSlider";
import {
  getHilltopAdsBannerUrl,
  getHilltopAdsVideoSliderUrl,
  isHilltopAdsEnabled,
} from "@/lib/hilltopads";
import { isAdSenseEnabled } from "@/lib/adsense";

type BlogAdsProps = {
  className?: string;
  /** Mid-page slot uses in-feed AdSense when available. */
  variant?: "top" | "mid";
};

/**
 * Blog monetization: Hilltop banner + Video Slider + AdSense.
 * Independent of Admin → Ads toggle so /blog always monetizes when scripts/slots exist.
 */
export function BlogAds({ className = "", variant = "top" }: BlogAdsProps) {
  const hilltopOn = isHilltopAdsEnabled();
  const bannerUrl = hilltopOn ? getHilltopAdsBannerUrl() : "";
  const sliderUrl = hilltopOn ? getHilltopAdsVideoSliderUrl() : "";
  const adsenseOn = isAdSenseEnabled();

  if (variant === "mid") {
    if (!adsenseOn) return null;
    return (
      <div className={`my-10 flex justify-center ${className}`.trim()} aria-label="Advertisement">
        <AdSenseUnit slot="infeed" format="fluid" className="min-h-[120px] w-full max-w-2xl" />
      </div>
    );
  }

  return (
    <>
      <div
        className={`flex flex-col items-center gap-4 py-4 ${className}`.trim()}
        aria-label="Advertisement"
      >
        {bannerUrl ? <HilltopAdsBanner scriptUrl={bannerUrl} /> : null}
        {adsenseOn ? (
          <AdSenseUnit slot="banner" format="horizontal" className="min-h-[90px] w-full max-w-3xl" />
        ) : (
          <AdPlacementBanner page="blog" className="w-full max-w-3xl" />
        )}
      </div>
      {sliderUrl ? <HilltopAdsVideoSlider scriptUrl={sliderUrl} /> : null}
    </>
  );
}
