"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";
import type { Locale } from "@/lib/types";

const locales: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ja", label: "JA" },
  { code: "ar", label: "AR" },
];

export function MobileHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { locale, setLocale, t } = useLocale();
  const { user, loading } = useAuth();

  return (
    <header
      className={`sticky top-0 z-50 bg-white dark:bg-black md:hidden ${
        isHome ? "" : "border-b border-zinc-200 dark:border-zinc-800"
      }`}
    >
      <div className="flex h-16 items-center justify-between gap-3 px-4">
        <Link href="/" className="flex items-center">
          <BrandLogo className="h-[4.5rem] w-[4.5rem]" priority />
        </Link>

        <div className="flex items-center gap-2">
          {!loading && !user && (
            <Link
              href="/signup"
              className="rounded-md border border-zinc-300 px-2 py-1 text-[10px] font-semibold text-black dark:border-zinc-700 dark:text-white"
            >
              {t.auth.signUp}
            </Link>
          )}
          <div
            className="flex items-center rounded-lg border border-zinc-200 bg-white p-0.5 dark:border-zinc-800 dark:bg-black"
            role="group"
            aria-label={t.locale.label}
          >
            {locales.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => setLocale(item.code)}
                className={`rounded-md px-2 py-1 text-[10px] font-semibold transition-colors ${
                  locale === item.code
                    ? "bg-accent text-white"
                    : "text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                }`}
                aria-pressed={locale === item.code}
              >
                {item.label}
              </button>
            ))}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
