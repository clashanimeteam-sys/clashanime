"use client";

import { useEffect } from "react";
import { BAIT_IDS } from "@/lib/adblockGuard";

const BAIT_CLASSNAMES: Record<(typeof BAIT_IDS)[number], string> = {
  adsbox: "adsbox adsbygoogle",
  "clashanime-ad-bait-1":
    "adsbygoogle ad-banner text-ad textAd text_ads banner-ads pub_300x250",
  "clashanime-ad-bait-2":
    "adsbox ad-container sponsored-content google-ad pub_728x90",
  "clashanime-ad-bait-3": "ad-slot ad-placement advertisement banner_ad",
  google_ads_iframe_check: "google-auto-placed",
};

/**
 * Inject bait nodes after hydration so cosmetic ad blockers cannot remove SSR
 * markup and trigger a React hydration crash.
 */
export function AdblockBait() {
  useEffect(() => {
    const host = document.createElement("div");
    host.setAttribute("aria-hidden", "true");
    host.style.cssText =
      "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;opacity:0;";

    for (const id of BAIT_IDS) {
      const bait = document.createElement("div");
      bait.id = id;
      bait.className = BAIT_CLASSNAMES[id];
      bait.setAttribute("aria-hidden", "true");
      host.appendChild(bait);
    }

    document.body.appendChild(host);
    return () => {
      host.remove();
    };
  }, []);

  return null;
}
