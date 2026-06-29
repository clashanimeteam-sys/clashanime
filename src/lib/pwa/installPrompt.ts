const DISMISS_KEY = "clashanime-pwa-install-dismissed";
const DISMISS_MS = 14 * 24 * 60 * 60 * 1000;

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function isAppInstalled() {
  if (typeof window === "undefined") return false;

  const standaloneMedia = window.matchMedia("(display-mode: standalone)").matches;
  const iosStandalone =
    "standalone" in window.navigator &&
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);

  return standaloneMedia || iosStandalone;
}

export function isIOSDevice() {
  if (typeof navigator === "undefined") return false;

  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function isIOSSafari() {
  if (typeof navigator === "undefined" || !isIOSDevice()) return false;

  const ua = navigator.userAgent;
  return /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS/.test(ua);
}

export function wasInstallPromptDismissed() {
  if (typeof window === "undefined") return false;

  const raw = window.localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;

  const dismissedAt = Number(raw);
  if (!Number.isFinite(dismissedAt)) return false;

  return Date.now() - dismissedAt < DISMISS_MS;
}

export function dismissInstallPrompt() {
  window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
}

export async function registerInstallServiceWorker() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

  try {
    await navigator.serviceWorker.register("/sw.js", { scope: "/" });
  } catch {
    // Install prompt can still show manual steps without a service worker.
  }
}
