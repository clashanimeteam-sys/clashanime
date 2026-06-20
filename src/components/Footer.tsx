"use client";

import Link from "next/link";
import { useLocale } from "@/providers/LocaleProvider";

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-sm font-semibold text-black dark:text-white">
            {t.brand.name}.com
          </p>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{t.footer.tagline}</p>
        </div>

        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-600 dark:text-zinc-400">
          <Link href="/privacy" className="transition-colors hover:text-accent">
            {t.footer.privacy}
          </Link>
          <Link href="/terms" className="transition-colors hover:text-accent">
            {t.footer.terms}
          </Link>
          <Link href="/community-guidelines" className="transition-colors hover:text-accent">
            {t.footer.communityGuidelines}
          </Link>
          <Link href="/dmca" className="transition-colors hover:text-accent">
            {t.footer.dmca}
          </Link>
          <Link href="/report" className="transition-colors hover:text-accent">
            {t.footer.reportContent}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
