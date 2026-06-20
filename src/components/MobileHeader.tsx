"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLocale } from "@/providers/LocaleProvider";
import type { Locale } from "@/lib/types";

const locales: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ja", label: "JA" },
  { code: "ar", label: "AR" },
];

export function MobileHeader() {
  const { locale, setLocale, t } = useLocale();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md md:hidden">
      <div className="flex h-14 items-center justify-between gap-3 px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="ClashAnime"
            width={36}
            height={36}
            priority
            className="h-9 w-9 rounded-md object-contain"
          />
          <span className="text-sm font-bold text-foreground">
            {t.brand.name}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center rounded-lg border border-border bg-surface p-0.5"
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
                    : "text-muted hover:text-foreground"
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
