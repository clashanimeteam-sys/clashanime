"use client";

import dynamic from "next/dynamic";

const MobileHeaderPlaceholder = () => (
  <div
    className="sticky top-0 z-50 h-14 border-b border-zinc-800/80 bg-black/70 backdrop-blur-md md:hidden"
    style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    aria-hidden
  />
);

const MobileNavPlaceholder = () => (
  <div
    className="fixed inset-x-0 bottom-0 z-40 h-[4.5rem] border-t border-zinc-800/80 bg-black/70 backdrop-blur-md md:hidden"
    style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    aria-hidden
  />
);

export const MobileAppHeader = dynamic(
  () => import("@/components/mobile/MobileAppHeader").then((module) => module.MobileAppHeader),
  { ssr: false, loading: MobileHeaderPlaceholder },
);

export const MobileBottomNav = dynamic(
  () => import("@/components/MobileBottomNav").then((module) => module.MobileBottomNav),
  { ssr: false, loading: MobileNavPlaceholder },
);

export const MobileInstallPrompt = dynamic(
  () =>
    import("@/components/mobile/MobileInstallPrompt").then(
      (module) => module.MobileInstallPrompt,
    ),
  { ssr: false },
);

export const MobileViewportLock = dynamic(
  () =>
    import("@/components/mobile/MobileViewportLock").then(
      (module) => module.MobileViewportLock,
    ),
  { ssr: false },
);
