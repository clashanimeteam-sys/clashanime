"use client";

import { AdSenseUnit } from "@/components/ads/AdSenseUnit";
import { useAdPlacements } from "@/hooks/useAdPlacements";
import { isAdPageEnabled, type AdPlacementSettings } from "@/lib/ads/placements";
import { resolveAdSenseSlotId } from "@/lib/adsense";
import { useLocale } from "@/providers/LocaleProvider";

type VideoReelsAdSlideProps = {
  isActive?: boolean;
  previewSettings?: AdPlacementSettings;
};

export function VideoReelsAdSlide({ isActive = false, previewSettings }: VideoReelsAdSlideProps) {
  const { t } = useLocale();
  const { settings: fetchedSettings } = useAdPlacements();
  const settings = previewSettings ?? fetchedSettings;
  const enabled = isAdPageEnabled(settings, "videoReels");

  if (!enabled) return null;

  const slotId = settings.slotInFeed || settings.slotBanner || undefined;
  const resolvedSlot = resolveAdSenseSlotId("infeed", slotId);
  const showPlaceholder = settings.showPreviewPlaceholders && !resolvedSlot;

  return (
    <section
      className="relative flex h-full min-h-0 w-full snap-start snap-always flex-col items-center justify-center bg-zinc-950 px-4"
      aria-label={t.ads.reelsSlideLabel}
      data-active={isActive ? "true" : "false"}
    >
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-300/90">
        {t.ads.placementLabel}
      </p>
      <div className="relative w-full max-w-md">
        {resolvedSlot ? (
          <AdSenseUnit
            slot="infeed"
            slotId={slotId}
            format="fluid"
            className="min-h-[250px] w-full"
          />
        ) : null}
        {showPlaceholder ? (
          <div
            className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-amber-400/50 bg-black/70 ${resolvedSlot ? "absolute inset-0" : "min-h-[250px]"}`}
          >
            <span className="rounded-full bg-amber-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-200">
              {t.ads.previewReels}
            </span>
            <span className="max-w-[220px] text-center text-xs text-zinc-400">
              {t.ads.previewReelsHint}
            </span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
