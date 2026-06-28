const AD_SCRIPT_URL = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
const AD_PIXEL_URL = "https://pagead2.googlesyndication.com/pagead/gen_204?id=clashanime";
const DOUBLECLICK_PIXEL = "https://ad.doubleclick.net/favicon.ico";

export const BAIT_IDS = [
  "clashanime-ad-bait-1",
  "clashanime-ad-bait-2",
  "clashanime-ad-bait-3",
  "google_ads_iframe_check",
] as const;

/** Minimum score (out of weighted checks) to treat ad blocker as active. */
const BLOCK_SCORE_THRESHOLD = 2;

export function isAdblockGuardEnabled() {
  if (process.env.NEXT_PUBLIC_ADBLOCK_GUARD === "false") return false;
  if (process.env.NEXT_PUBLIC_ADBLOCK_GUARD === "true") return true;
  return process.env.NODE_ENV === "production";
}

function isElementBlocked(element: HTMLElement | null) {
  if (!element || !element.isConnected) return true;

  const style = window.getComputedStyle(element);
  if (
    style.display === "none" ||
    style.visibility === "hidden" ||
    Number.parseFloat(style.opacity) === 0 ||
    element.offsetParent === null ||
    element.clientHeight === 0 ||
    element.clientWidth === 0
  ) {
    return true;
  }

  return false;
}

function detectStaticBaits() {
  return BAIT_IDS.some((id) => isElementBlocked(document.getElementById(id)));
}

function detectDynamicBait() {
  const bait = document.createElement("div");
  bait.className =
    "adsbox adsbygoogle ad-banner text-ad textAd text_ads banner-ads ad-container sponsored-content pub_300x250 pub_728x90";
  bait.innerHTML = "&nbsp;";
  bait.setAttribute("aria-hidden", "true");
  bait.style.cssText =
    "position:absolute!important;left:-9999px!important;top:-9999px!important;width:1px!important;height:1px!important;";

  document.body.appendChild(bait);
  const blocked = isElementBlocked(bait);
  bait.remove();
  return blocked;
}

function detectIframeBait() {
  return new Promise<boolean>((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.title = "advertisement";
    iframe.src = "about:blank";
    iframe.style.cssText =
      "position:absolute!important;left:-9999px!important;top:-9999px!important;width:1px!important;height:1px!important;border:0!important;";

    let settled = false;
    const finish = (blocked: boolean) => {
      if (settled) return;
      settled = true;
      iframe.remove();
      resolve(blocked);
    };

    iframe.onload = () => {
      window.setTimeout(() => finish(isElementBlocked(iframe)), 120);
    };
    iframe.onerror = () => finish(true);
    window.setTimeout(() => finish(isElementBlocked(iframe)), 1200);
    document.body.appendChild(iframe);
  });
}

function detectResourceBlocked(url: string, timeoutMs = 2200) {
  return new Promise<boolean>((resolve) => {
    const img = new Image();
    let settled = false;

    const finish = (blocked: boolean) => {
      if (settled) return;
      settled = true;
      resolve(blocked);
    };

    img.onload = () => finish(false);
    img.onerror = () => finish(true);
    img.src = `${url}?${Date.now()}`;
    window.setTimeout(() => finish(true), timeoutMs);
  });
}

function detectAdScriptBlocked() {
  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `${AD_SCRIPT_URL}?${Date.now()}`;
    let settled = false;

    const finish = (blocked: boolean) => {
      if (settled) return;
      settled = true;
      script.remove();
      resolve(blocked);
    };

    script.onload = () => finish(false);
    script.onerror = () => finish(true);
    window.setTimeout(() => finish(true), 2800);
    document.head.appendChild(script);
  });
}

function detectAdsByGoogleQueue() {
  try {
    const queue = (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle;
    if (!Array.isArray(queue)) return false;
    queue.push({});
    return false;
  } catch {
    return true;
  }
}

type DetectionSignal = {
  id: string;
  weight: number;
  blocked: boolean;
};

/** Returns true when an ad blocker is likely active. */
export async function detectAdblock() {
  if (typeof window === "undefined") return false;

  const staticBaits = detectStaticBaits();
  const dynamicBait = detectDynamicBait();
  const adsQueueBlocked = detectAdsByGoogleQueue();

  if (staticBaits || dynamicBait || adsQueueBlocked) {
    return true;
  }

  const [iframeBait, adScript, adPixel, doubleClick] = await Promise.all([
    detectIframeBait(),
    detectAdScriptBlocked(),
    detectResourceBlocked(AD_PIXEL_URL),
    detectResourceBlocked(DOUBLECLICK_PIXEL),
  ]);

  const signals: DetectionSignal[] = [
    { id: "static", weight: 3, blocked: staticBaits },
    { id: "dynamic", weight: 3, blocked: dynamicBait },
    { id: "iframe", weight: 2, blocked: iframeBait },
    { id: "script", weight: 2, blocked: adScript },
    { id: "pixel", weight: 2, blocked: adPixel },
    { id: "doubleclick", weight: 2, blocked: doubleClick },
    { id: "queue", weight: 2, blocked: adsQueueBlocked },
  ];

  const score = signals.reduce((total, signal) => total + (signal.blocked ? signal.weight : 0), 0);
  return score >= BLOCK_SCORE_THRESHOLD;
}

export function shouldSkipAdblockGuard(pathname: string) {
  return pathname.startsWith("/admin");
}

export function watchAdblockBaits(onBlocked: () => void) {
  if (typeof window === "undefined" || typeof MutationObserver === "undefined") {
    return () => {};
  }

  const observer = new MutationObserver(() => {
    if (detectStaticBaits() || detectDynamicBait()) {
      onBlocked();
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: ["style", "class", "hidden"],
  });

  return () => observer.disconnect();
}
