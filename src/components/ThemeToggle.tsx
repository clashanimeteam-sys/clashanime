"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { useLocale } from "@/providers/LocaleProvider";

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useLocale();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!mounted) {
    return (
      <div
        aria-hidden
        className="h-7 w-12 rounded-full bg-zinc-200 dark:bg-zinc-700"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? t.theme.light : t.theme.dark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full bg-zinc-200 p-0.5 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:bg-zinc-700"
    >
      <span
        aria-hidden
        className={`pointer-events-none block h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${
          isDark ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
