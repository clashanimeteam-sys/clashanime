"use client";

import dynamic from "next/dynamic";

const MobileHeaderPlaceholder = () => (
  <div
    className="sticky top-0 z-50 h-14 border-b border-zinc-200/80 bg-white/95 md:hidden dark:border-zinc-800/80 dark:bg-black/95"
    style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    aria-hidden
  />
);

const MobileNavPlaceholder = () => (
  <div
    className="fixed inset-x-0 bottom-0 z-40 h-[4.5rem] border-t border-zinc-200/90 bg-white/95 md:hidden dark:border-zinc-800/90 dark:bg-black/95"
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
