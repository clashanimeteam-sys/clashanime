"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import {
  getDotlottieServerSnapshot,
  getDotlottieSnapshot,
  subscribeDotlottie,
} from "@/lib/dotlottieReady";
import {
  THEME_TOGGLE_DARK_FRAME,
  THEME_TOGGLE_LIGHT_FRAME,
  THEME_TOGGLE_LOTTIE_SIZE_PX,
  THEME_TOGGLE_LOTTIE_SRC,
  THEME_TOGGLE_TRANSITION_END,
  THEME_TOGGLE_TRANSITION_START,
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

type DotLottieMode = "forward" | "reverse" | "bounce" | "reverse-bounce";

type DotLottiePlayer = {
  play: () => void;
  pause: () => void;
  stop: () => void;
  setLoop: (loop: boolean) => void;
  setMode: (mode: DotLottieMode) => void;
  setFrame: (frame: number) => void;
  setSegment: (start: number, end: number) => void;
  freeze?: () => void;
  unfreeze?: () => void;
  totalFrames: number;
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
  if (attempts < 60) {
    requestAnimationFrame(() => waitForDotLottiePlayer(element, onReady, attempts + 1));
  }
}

function holdThemeFrame(player: DotLottiePlayer, isDark: boolean) {
  const frame = getThemeToggleFrame(isDark);
  player.unfreeze?.();
  player.setLoop(false);
  player.setMode("forward");
  player.setSegment(frame, frame);
  player.setFrame(frame);
  player.pause();
  player.freeze?.();
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
    const onComplete = () => {
      player.removeEventListener("complete", onComplete);
      holdThemeFrame(player, toDark);
      onDone();
    };

    player.unfreeze?.();
    player.removeEventListener("complete", onComplete);
    player.addEventListener("complete", onComplete);
    player.setLoop(false);
    player.setSegment(THEME_TOGGLE_TRANSITION_START, THEME_TOGGLE_TRANSITION_END);

    if (toDark) {
      player.setMode("reverse");
      player.setFrame(THEME_TOGGLE_LIGHT_FRAME);
    } else {
      player.setMode("forward");
      player.setFrame(THEME_TOGGLE_DARK_FRAME);
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
  const themeReady = resolvedTheme !== undefined;
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

    const sync = () => {
      if (!themeReady || isAnimatingRef.current) return;
      waitForDotLottiePlayer(node, (player) => {
        if (isAnimatingRef.current) return;
        holdThemeFrame(player, isDarkRef.current);
      });
    };

    node.addEventListener("ready", sync);
    node.addEventListener("load", sync);
    sync();

    return () => {
      node.removeEventListener("ready", sync);
      node.removeEventListener("load", sync);
    };
  }, [themeReady]);

  useEffect(() => {
    if (!themeReady) return;
    syncStaticFrame(isDark);
  }, [isDark, themeReady, syncStaticFrame]);

  const handleToggle = useCallback(() => {
    if (!mounted || !themeReady) return;
    const nextDark = !isDark;
    isAnimatingRef.current = true;
    setTheme(nextDark ? "dark" : "light");
    playThemeTransition(lottieRef.current, nextDark, () => {
      isAnimatingRef.current = false;
    });
  }, [isDark, mounted, setTheme, themeReady]);

  const size = THEME_TOGGLE_LOTTIE_SIZE_PX;
  const showLottie = mounted && dotlottieReady;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={themeReady ? isDark : false}
      aria-label={isDark ? t.theme.light : t.theme.dark}
      title={isDark ? t.theme.light : t.theme.dark}
      onClick={handleToggle}
      disabled={!mounted || !themeReady}
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-transparent p-0 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-80"
      style={{ width: size, height: size }}
      suppressHydrationWarning
    >
      {showLottie ? (
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
  );
}
