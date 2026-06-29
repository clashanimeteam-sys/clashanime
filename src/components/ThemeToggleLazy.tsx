"use client";

import dynamic from "next/dynamic";

const ThemeTogglePlaceholder = () => (
  <span
    aria-hidden
    className="inline-block h-12 w-12 shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-700"
  />
);

export const ThemeToggle = dynamic(
  () => import("@/components/ThemeToggle").then((module) => module.ThemeToggle),
  { ssr: false, loading: ThemeTogglePlaceholder },
);
