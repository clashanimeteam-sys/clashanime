const AD_SCRIPT_URL = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
const AD_PIXEL_URL = "https://pagead2.googlesyndication.com/pagead/gen_204?id=clashanime";

export const BAIT_IDS = [
  "adsbox",
  "clashanime-ad-bait-1",
  "clashanime-ad-bait-2",
  "clashanime-ad-bait-3",
  "google_ads_iframe_check",
] as const;

const BAIT_STYLE =
  "position:absolute!important;width:1px!important;height:1px!important;opacity:0.01!important;top:0!important;left:0!important;pointer-events:none!important;overflow:hidden!important;";

const SCRIPT_PROBE_MS = 2_500;

export function isAdblockGuardEnabled() {
  if (process.env.NEXT_PUBLIC_ADBLOCK_GUARD === "false") return false;
  if (process.env.NEXT_PUBLIC_ADBLOCK_GUARD === "true") return true;
  return process.env.NODE_ENV === "production";
}

/** True when an element was hidden by an ad blocker, not our intentional bait styling. */
function isHiddenByAdblock(element: HTMLElement) {
  const style = window.getComputedStyle(element);
  if (style.display === "none") return true;
  if (style.visibility === "hidden") return true;
  if (Number.parseFloat(style.opacity) === 0) return true;

  const rect = element.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return true;

  // EasyList / AdBlock cosmetic filters often collapse ad-class nodes to zero height.
  if (element.offsetHeight === 0 && element.offsetWidth === 0) return true;

  return false;
}

function countStaticBaitsBlocked() {
  return BAIT_IDS.reduce((count, id) => {
    const element = document.getElementById(id);
    if (element && isHiddenByAdblock(element)) return count + 1;
    return count;
  }, 0);
}

function detectStaticBaitsBlocked() {
  return countStaticBaitsBlocked() >= 1;
}

/**
 * Classic #adsbox probe used by AdBlock, uBlock Origin, and EasyList-based extensions.
 */
function detectEasyListBait() {
  const bait = document.createElement("div");
  bait.id = "clashanime-probe-adsbox";
  bait.className = "adsbox adsbygoogle";
  bait.innerHTML = "&nbsp;";
  bait.style.cssText = BAIT_STYLE;
  bait.setAttribute("aria-hidden", "true");

  document.body.appendChild(bait);
  const blocked = isHiddenByAdblock(bait);
  bait.remove();
  return blocked;
}

/** Compare ad-class bait vs neutral control — avoids mobile false positives from layout. */
function detectDifferentialBait() {
  const control = document.createElement("div");
  control.style.cssText = BAIT_STYLE;
  control.setAttribute("aria-hidden", "true");

  const bait = document.createElement("div");
  bait.className =
    "adsbox adsbygoogle ad-banner text-ad textAd text_ads banner-ads ad-container sponsored-content pub_300x250 pub_728x90";
  bait.style.cssText = BAIT_STYLE;
  bait.innerHTML = "&nbsp;";
  bait.setAttribute("aria-hidden", "true");

  document.body.appendChild(control);
  document.body.appendChild(bait);

  const baitBlocked = isHiddenByAdblock(bait);
  const controlBlocked = isHiddenByAdblock(control);

  control.remove();
  bait.remove();

  return baitBlocked && !controlBlocked;
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

/** AdBlock and similar extensions block or stall the AdSense script request. */
function detectAdScriptBlocked() {
  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `${AD_SCRIPT_URL}?${Date.now()}`;
    let settled = false;
    let loaded = false;

    const finish = (blocked: boolean) => {
      if (settled) return;
      settled = true;
      script.remove();
      resolve(blocked);
    };

    script.onload = () => {
      loaded = true;
      finish(false);
    };
    script.onerror = () => finish(true);
    window.setTimeout(() => {
      if (!loaded) finish(true);
    }, SCRIPT_PROBE_MS);
    document.head.appendChild(script);
  });
}

/** Network probe — AdBlock blocks requests to googlesyndication even when baits stay visible. */
function detectAdPixelBlocked() {
  return new Promise<boolean>((resolve) => {
    const img = new Image();
    let settled = false;
    let loaded = false;

    const finish = (blocked: boolean) => {
      if (settled) return;
      settled = true;
      resolve(blocked);
    };

    img.onload = () => {
      loaded = true;
      finish(false);
    };
    img.onerror = () => finish(true);
    img.src = `${AD_PIXEL_URL}&_=${Date.now()}`;
    window.setTimeout(() => {
      if (!loaded) finish(true);
    }, SCRIPT_PROBE_MS);
  });
}

function waitForExtensionCss() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

/** Returns true when an ad blocker is likely active. */
export async function detectAdblock() {
  if (typeof window === "undefined") return false;

  await waitForExtensionCss();

  if (detectEasyListBait()) return true;
  if (detectDifferentialBait()) return true;
  if (detectStaticBaitsBlocked()) return true;
  if (detectAdsByGoogleQueue()) return true;

  const [scriptBlocked, pixelBlocked] = await Promise.all([
    detectAdScriptBlocked(),
    detectAdPixelBlocked(),
  ]);

  if (scriptBlocked || pixelBlocked) return true;

  return false;
}

export function shouldSkipAdblockGuard(pathname: string) {
  return pathname.startsWith("/admin");
}

export function watchAdblockBaits(onBlocked: () => void) {
  if (typeof window === "undefined" || typeof MutationObserver === "undefined") {
    return () => {};
  }

  let debounceTimer: number | null = null;
  let checking = false;

  const scheduleCheck = () => {
    if (debounceTimer !== null) return;
    debounceTimer = window.setTimeout(() => {
      debounceTimer = null;
      if (checking) return;
      checking = true;
      try {
        if (
          detectEasyListBait() ||
          detectStaticBaitsBlocked() ||
          detectDifferentialBait()
        ) {
          onBlocked();
        }
      } finally {
        checking = false;
      }
    }, 300);
  };

  const observer = new MutationObserver(scheduleCheck);

  observer.observe(document.documentElement, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: ["style", "class", "hidden"],
  });

  return () => {
    if (debounceTimer !== null) window.clearTimeout(debounceTimer);
    observer.disconnect();
  };
}
