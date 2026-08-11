"use client";

import { useEffect, useState } from "react";
import { AdSenseUnit } from "@/components/ads/AdSenseUnit";
import { useAdPlacements } from "@/hooks/useAdPlacements";
import {
  getAdSenseClientId,
  isAdSenseScriptReady,
  resolveAdSenseSlotId,
} from "@/lib/adsense";
import { useLocale } from "@/providers/LocaleProvider";

type BlogAdsProps = {
  className?: string;
  /**
   * top / bottom — horizontal banner
   * mid / between — in-feed fluid
   * rectangle — 300×250-style block
   */
  variant?: "top" | "mid" | "bottom" | "between" | "rectangle";
};

const COPY = {
  ar: {
    label: "إعلان",
    waiting: "جاري تحميل الإعلان…",
    missingSlot: "أضف Slot ID من الإدارة ← الإعلانات (أو NEXT_PUBLIC_ADSENSE_SLOT)",
  },
  en: {
    label: "Ad",
    waiting: "Loading ad…",
    missingSlot: "Add a Slot ID in Admin → Ads (or NEXT_PUBLIC_ADSENSE_SLOT)",
  },
  ja: {
    label: "広告",
    waiting: "広告を読み込み中…",
    missingSlot: "管理画面で Slot ID を設定してください",
  },
} as const;

/**
 * Visible AdSense shells for Heroes Guide (/blog).
 * Always shows a labeled frame so empty Google fills are still obvious.
 * Uses admin slot IDs when set, otherwise env slot IDs.
 * Does not depend on the global ads master switch (pages.blog=false still hides).
 */
export function BlogAds({ className = "", variant = "top" }: BlogAdsProps) {
  const { locale } = useLocale();
  const { settings } = useAdPlacements();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const copy = COPY[locale === "ar" || locale === "ja" ? locale : "en"];
  const clientReady = isAdSenseScriptReady() && Boolean(getAdSenseClientId());

  // Only the per-page blog flag can hide Heroes Guide ads — not the global master switch.
  if (!clientReady || settings.pages.blog === false) return null;

  const isRect = variant === "rectangle";
  const isInfeed = variant === "mid" || variant === "between";
  const slotVariant = isRect ? "sidebar" : isInfeed ? "infeed" : "banner";
  const adminSlot = isInfeed
    ? settings.slotInFeed || settings.slotBanner
    : settings.slotBanner || settings.slotInFeed;
  const slotId = resolveAdSenseSlotId(slotVariant, adminSlot || undefined);

  const shellClass = isRect
    ? "min-h-[270px] max-w-[320px] w-full"
    : isInfeed
      ? "min-h-[140px] w-full max-w-2xl"
      : "min-h-[110px] w-full max-w-3xl";

  return (
    <div
      className={`my-6 flex justify-center sm:my-8 ${className}`.trim()}
      aria-label="Advertisement"
      data-blog-ad={variant}
    >
      <div
        className={`relative overflow-hidden rounded-2xl border border-amber-500/40 bg-zinc-900/90 px-2 pb-2 pt-7 shadow-[inset_0_0_0_1px_rgba(251,191,36,0.08)] ${shellClass}`}
      >
        <span className="absolute start-3 top-2 z-10 rounded-md bg-amber-500/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-100">
          {copy.label}
        </span>

        {mounted && slotId ? (
          <AdSenseUnit
            slot={slotVariant}
            slotId={slotId}
            format={isRect ? "rectangle" : isInfeed ? "fluid" : "horizontal"}
            className={isRect ? "min-h-[250px] w-full" : "min-h-[90px] w-full"}
          />
        ) : (
          <div className="flex min-h-[90px] items-center justify-center px-4 text-center text-xs font-semibold leading-relaxed text-zinc-400">
            {mounted ? copy.missingSlot : copy.waiting}
          </div>
        )}
      </div>
    </div>
  );
}
