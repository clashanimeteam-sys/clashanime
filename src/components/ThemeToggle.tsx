"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
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

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useLocale();
  const mounted = useSyncExternalStore(subscribeMounted, getMountedSnapshot, getMountedServerSnapshot);
  const themeReady = resolvedTheme !== undefined;
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={themeReady ? isDark : false}
      aria-label={isDark ? t.theme.light : t.theme.dark}
      title={isDark ? t.theme.light : t.theme.dark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      disabled={!mounted || !themeReady}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-lg transition-colors hover:bg-zinc-50 disabled:opacity-70 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
      suppressHydrationWarning
    >
      <span aria-hidden>{!mounted || !themeReady ? "◐" : isDark ? "🌙" : "☀️"}</span>
    </button>
  );
}
