"use client";

import { TrafficStarsBanner } from "@/components/ads/TrafficStarsBanner";
import { TrafficStarsPopunder } from "@/components/ads/TrafficStarsPopunder";
import { useAdPlacements } from "@/hooks/useAdPlacements";
import { isAdPageEnabled } from "@/lib/ads/placements";
import { getTrafficStarsBannerSpot, getTrafficStarsPopunderUrl } from "@/lib/trafficstars";
import { useLocale } from "@/providers/LocaleProvider";

export function WatchPageAds() {
  const { t } = useLocale();
  const { settings } = useAdPlacements();

  if (!isAdPageEnabled(settings, "watch")) return null;

  const bannerSpot = settings.slotWatchBanner.trim() || getTrafficStarsBannerSpot();
  const popunderUrl = settings.slotWatchPopunder.trim() || getTrafficStarsPopunderUrl();
  const showPlaceholder = settings.showPreviewPlaceholders && !bannerSpot && !popunderUrl;

  if (!bannerSpot && !popunderUrl && !showPlaceholder) return null;

  return (
    <>
      {popunderUrl ? <TrafficStarsPopunder scriptUrl={popunderUrl} /> : null}
      {bannerSpot ? (
        <div className="shrink-0 border-b border-zinc-800 bg-zinc-950/95 px-2 py-1">
          <p className="mb-1 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">
            {t.ads.placementLabel}
          </p>
          <TrafficStarsBanner spotId={bannerSpot} />
        </div>
      ) : showPlaceholder ? (
        <div className="shrink-0 border-b border-dashed border-amber-500/40 bg-amber-950/20 px-3 py-3 text-center text-xs text-amber-200/80">
          {t.ads.previewWatchBanner}
        </div>
      ) : null}
    </>
  );
}
