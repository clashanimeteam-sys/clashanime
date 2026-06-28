"use client";

import { AdSenseUnit } from "@/components/ads/AdSenseUnit";
import { isAdSenseEnabled } from "@/lib/adsense";

type SiteAdBannerProps = {
  placement: "mobile-footer" | "desktop-inline";
};

export function SiteAdBanner({ placement }: SiteAdBannerProps) {
  if (!isAdSenseEnabled()) return null;

  if (placement === "mobile-footer") {
    return (
      <div className="border-t border-zinc-200 bg-zinc-50 px-2 py-2 dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
        <AdSenseUnit slot="banner" format="horizontal" className="mx-auto min-h-[50px] max-w-lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto hidden max-w-5xl px-4 py-4 md:block">
      <AdSenseUnit slot="banner" format="horizontal" className="min-h-[90px]" />
    </div>
  );
}
