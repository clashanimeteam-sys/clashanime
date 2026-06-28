"use client";

import Link from "next/link";
import { SiteErrorScreen } from "@/components/SiteErrorScreen";
import { useLocale } from "@/providers/LocaleProvider";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ reset }: GlobalErrorProps) {
  const { t } = useLocale();

  return (
    <SiteErrorScreen
      title={t.common.unexpectedErrorTitle}
      description={t.common.unexpectedErrorDesc}
      actions={
        <>
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
          >
            {t.common.tryAgain}
          </button>
          <Link
            href="/"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900"
          >
            {t.common.backToHome}
          </Link>
        </>
      }
    />
  );
}
