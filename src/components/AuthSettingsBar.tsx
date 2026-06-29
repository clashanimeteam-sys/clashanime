"use client";

import { LocaleFlags } from "@/components/LocaleFlags";
import { ThemeToggle } from "@/components/ThemeToggleLazy";
import { useLocale } from "@/providers/LocaleProvider";

export function AuthSettingsBar() {
  const { t } = useLocale();

  return (
    <footer className="fixed inset-x-0 bottom-0 z-10 border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-black/95 sm:px-6">
      <div className="mx-auto flex max-w-sm items-center justify-between gap-4">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{t.nav.settings}</span>
        <div className="flex items-center gap-3">
          <LocaleFlags />
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
