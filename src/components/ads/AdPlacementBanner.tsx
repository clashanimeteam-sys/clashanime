"use client";

import { AdSenseUnit } from "@/components/ads/AdSenseUnit";
import { useAdPlacements } from "@/hooks/useAdPlacements";
import {
  isAdPageEnabled,
  type AdPageKey,
  type AdPlacementSettings,
} from "@/lib/ads/placements";
import { resolveAdSenseSlotId } from "@/lib/adsense";
import { useLocale } from "@/providers/LocaleProvider";

type AdPlacementBannerProps = {
  page: AdPageKey;
  className?: string;
  previewLabel?: string;
  previewSettings?: AdPlacementSettings;
};

export function AdPlacementBanner({
  page,
  className = "",
  previewLabel,
  previewSettings,
}: AdPlacementBannerProps) {
  const { t } = useLocale();
  const { settings: fetchedSettings } = useAdPlacements();
  const settings = previewSettings ?? fetchedSettings;
  const enabled = isAdPageEnabled(settings, page);

  if (!enabled) return null;

  const slotId = settings.slotBanner || undefined;
  const resolvedSlot = resolveAdSenseSlotId("banner", slotId);
  const showPlaceholder = settings.showPreviewPlaceholders && !resolvedSlot;

  return (
    <div
      className={`relative rounded-2xl border border-dashed border-amber-500/40 bg-amber-950/20 px-3 py-3 ${className}`.trim()}
      data-ad-page={page}
    >
      <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300/90">
        {previewLabel ?? t.ads.placementLabel}
      </p>
      {resolvedSlot ? (
        <AdSenseUnit slot="banner" slotId={slotId} format="horizontal" className="min-h-[90px]" />
      ) : null}
      {showPlaceholder ? (
        <div
          className={`flex items-center justify-center rounded-xl border border-amber-400/30 bg-black/40 ${resolvedSlot ? "absolute inset-3" : "min-h-[90px]"}`}
        >
          <span className="text-xs font-semibold text-amber-200/80">{t.ads.previewBanner}</span>
        </div>
      ) : null}
    </div>
  );
}
