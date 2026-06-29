"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { SiteErrorScreen } from "@/components/SiteErrorScreen";
import { dictionaries } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/types";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

function readErrorLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem("clashanime-locale");
  return stored === "ar" || stored === "ja" || stored === "en" ? stored : "en";
}

function subscribeErrorLocale() {
  return () => {};
}

export default function Error({ reset }: ErrorProps) {
  const locale = useSyncExternalStore(subscribeErrorLocale, readErrorLocale, () => "en" as Locale);
  const t = dictionaries[locale].common;

  return (
    <SiteErrorScreen
      title={t.unexpectedErrorTitle}
      description={t.unexpectedErrorDesc}
      actions={
        <>
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
          >
            {t.tryAgain}
          </button>
          <Link
            href="/"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900"
          >
            {t.backToHome}
          </Link>
        </>
      }
    />
  );
}
