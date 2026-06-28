const AD_SCRIPT_URL = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
const BAIT_IDS = ["clashanime-ad-bait-1", "clashanime-ad-bait-2"] as const;

export function isAdblockGuardEnabled() {
  if (process.env.NEXT_PUBLIC_ADBLOCK_GUARD === "false") return false;
  if (process.env.NEXT_PUBLIC_ADBLOCK_GUARD === "true") return true;
  return process.env.NODE_ENV === "production";
}

function isElementBlocked(element: HTMLElement | null) {
  if (!element) return false;

  const style = window.getComputedStyle(element);
  if (
    style.display === "none" ||
    style.visibility === "hidden" ||
    style.opacity === "0" ||
    element.offsetParent === null ||
    element.offsetHeight === 0 ||
    element.offsetWidth === 0
  ) {
    return true;
  }

  return false;
}

function detectBaitElements() {
  return BAIT_IDS.some((id) => {
    const element = document.getElementById(id);
    return isElementBlocked(element);
  });
}

function detectDynamicBait() {
  const bait = document.createElement("div");
  bait.className =
    "adsbox adsbygoogle ad-banner text-ad textAd text_ads banner-ads ad-container sponsored-content";
  bait.innerHTML = "&nbsp;";
  bait.setAttribute("aria-hidden", "true");
  bait.style.cssText =
    "position:absolute!important;left:-9999px!important;top:-9999px!important;width:1px!important;height:1px!important;";

  document.body.appendChild(bait);
  const blocked = isElementBlocked(bait);
  bait.remove();
  return blocked;
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

/** Returns true when an ad blocker is likely active. */
export async function detectAdblock() {
  if (typeof window === "undefined") return false;

  const baitBlocked = detectBaitElements() || detectDynamicBait();
  if (baitBlocked) return true;

  try {
    return await detectAdScriptBlocked();
  } catch {
    return baitBlocked;
  }
}

export function shouldSkipAdblockGuard(pathname: string) {
  return pathname.startsWith("/admin");
}
