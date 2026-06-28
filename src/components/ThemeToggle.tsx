"use client";

import Script from "next/script";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import {
  DOTLOTTIE_WC_SCRIPT_SRC,
  THEME_TOGGLE_LOTTIE_SIZE_PX,
  THEME_TOGGLE_LOTTIE_SRC,
} from "@/lib/themeToggleLottie";
import { useLocale } from "@/providers/LocaleProvider";

function subscribeMounted() {
  return () => {};
}

function getMountedSnapshot() {
  return true;
}

function getMountedServerSnapshot() {
  return false;
}

let dotlottieScriptReady = false;
const dotlottieListeners = new Set<() => void>();

function subscribeDotlottie(onStoreChange: () => void) {
  dotlottieListeners.add(onStoreChange);
  return () => {
    dotlottieListeners.delete(onStoreChange);
  };
}

function getDotlottieSnapshot() {
  return dotlottieScriptReady;
}

function getDotlottieServerSnapshot() {
  return false;
}

function markDotlottieReady() {
  if (dotlottieScriptReady) return;
  dotlottieScriptReady = true;
  dotlottieListeners.forEach((listener) => listener());
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useLocale();
  const mounted = useSyncExternalStore(subscribeMounted, getMountedSnapshot, getMountedServerSnapshot);
  const dotlottieReady = useSyncExternalStore(
    subscribeDotlottie,
    getDotlottieSnapshot,
    getDotlottieServerSnapshot,
  );

  if (!mounted) {
    return (
      <div
        aria-hidden
        className="h-12 w-12 shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-800"
      />
    );
  }

  const isDark = resolvedTheme === "dark";
  const size = THEME_TOGGLE_LOTTIE_SIZE_PX;

  return (
    <>
      <Script
        id="dotlottie-wc"
        src={DOTLOTTIE_WC_SCRIPT_SRC}
        type="module"
        strategy="afterInteractive"
        onReady={markDotlottieReady}
        onLoad={markDotlottieReady}
      />
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? t.theme.light : t.theme.dark}
        title={isDark ? t.theme.light : t.theme.dark}
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-transparent p-0 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        style={{ width: size, height: size }}
      >
        {dotlottieReady ? (
          <dotlottie-wc
            src={THEME_TOGGLE_LOTTIE_SRC}
            autoplay
            loop
            style={{ width: size, height: size }}
          />
        ) : (
          <span
            aria-hidden
            className="inline-block rounded-full bg-zinc-200 dark:bg-zinc-700"
            style={{ width: size, height: size }}
          />
        )}
      </button>
    </>
  );
}
