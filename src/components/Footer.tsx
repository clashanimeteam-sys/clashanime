"use client";

import Link from "next/link";
import { useLocale } from "@/providers/LocaleProvider";

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {t.brand.name}.com
          </p>
          <p className="mt-1 text-xs text-muted">{t.footer.tagline}</p>
        </div>

        <nav className="flex flex-wrap gap-4 text-xs text-muted">
          <Link href="/terms" className="transition-colors hover:text-accent">
            {t.footer.terms}
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
