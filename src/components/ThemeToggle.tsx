"use client";

import Script from "next/script";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import {
  DOTLOTTIE_WC_SCRIPT_SRC,
  THEME_TOGGLE_LIGHT_FRAME,
  THEME_TOGGLE_LOTTIE_SIZE_PX,
  THEME_TOGGLE_LOTTIE_SRC,
  getThemeToggleDarkFrame,
  getThemeToggleFrame,
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

type DotLottieMode = "forward" | "reverse" | "bounce" | "reverse-bounce";

type DotLottiePlayer = {
  play: () => void;
  pause: () => void;
  stop: () => void;
  setLoop: (loop: boolean) => void;
  setMode: (mode: DotLottieMode) => void;
  setFrame: (frame: number) => void;
  setSegment: (start: number, end: number) => void;
  resetSegment?: () => void;
  totalFrames: number;
  isPlaying: boolean;
  addEventListener: (event: string, listener: () => void) => void;
  removeEventListener: (event: string, listener: () => void) => void;
};

type DotLottieElement = HTMLElement & {
  dotLottie?: DotLottiePlayer;
};

function waitForDotLottiePlayer(
  element: DotLottieElement,
  onReady: (player: DotLottiePlayer) => void,
  attempts = 0,
) {
  const player = element.dotLottie;
  if (player && player.totalFrames > 0) {
    onReady(player);
    return;
  }
  if (attempts < 40) {
    requestAnimationFrame(() => waitForDotLottiePlayer(element, onReady, attempts + 1));
  }
}

function holdThemeFrame(player: DotLottiePlayer, isDark: boolean) {
  player.setLoop(false);
  player.setMode("forward");
  player.setFrame(getThemeToggleFrame(player.totalFrames, isDark));
  player.pause();
}

function playThemeTransition(
  element: DotLottieElement | null,
  toDark: boolean,
  onDone: () => void,
) {
  if (!element) {
    onDone();
    return;
  }

  waitForDotLottiePlayer(element, (player) => {
    const darkFrame = getThemeToggleDarkFrame(player.totalFrames);
    const onComplete = () => {
      player.removeEventListener("complete", onComplete);
      player.setFrame(getThemeToggleFrame(player.totalFrames, toDark));
      player.pause();
      player.resetSegment?.();
      onDone();
    };

    player.removeEventListener("complete", onComplete);
    player.addEventListener("complete", onComplete);
    player.setLoop(false);
    player.setSegment(THEME_TOGGLE_LIGHT_FRAME, darkFrame);

    if (toDark) {
      player.setMode("forward");
      player.setFrame(THEME_TOGGLE_LIGHT_FRAME);
    } else {
      player.setMode("reverse");
      player.setFrame(darkFrame);
    }

    player.play();
  });
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useLocale();
  const lottieRef = useRef<DotLottieElement | null>(null);
  const isAnimatingRef = useRef(false);
  const mounted = useSyncExternalStore(subscribeMounted, getMountedSnapshot, getMountedServerSnapshot);
  const dotlottieReady = useSyncExternalStore(
    subscribeDotlottie,
    getDotlottieSnapshot,
    getDotlottieServerSnapshot,
  );
  const isDark = resolvedTheme === "dark";
  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;

  const syncStaticFrame = useCallback((dark: boolean) => {
    const element = lottieRef.current;
    if (!element || isAnimatingRef.current) return;
    waitForDotLottiePlayer(element, (player) => {
      if (isAnimatingRef.current) return;
      holdThemeFrame(player, dark);
    });
  }, []);

  const setLottieRef = useCallback((node: DotLottieElement | null) => {
    lottieRef.current = node;
    if (!node) return;
    waitForDotLottiePlayer(node, (player) => {
      if (isAnimatingRef.current) return;
      holdThemeFrame(player, isDarkRef.current);
    });
  }, []);

  useEffect(() => {
    syncStaticFrame(isDark);
  }, [isDark, syncStaticFrame]);

  const handleToggle = useCallback(() => {
    const nextDark = !isDark;
    isAnimatingRef.current = true;
    setTheme(nextDark ? "dark" : "light");
    playThemeTransition(lottieRef.current, nextDark, () => {
      isAnimatingRef.current = false;
    });
  }, [isDark, setTheme]);

  if (!mounted) {
    return (
      <div
        aria-hidden
        className="h-12 w-12 shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-800"
      />
    );
  }

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
        onClick={handleToggle}
        className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-transparent p-0 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        style={{ width: size, height: size }}
      >
        {dotlottieReady ? (
          <dotlottie-wc
            ref={setLottieRef}
            src={THEME_TOGGLE_LOTTIE_SRC}
            loop={false}
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
