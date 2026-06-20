"use client";

import { useLocale } from "@/providers/LocaleProvider";
import type { Locale } from "@/lib/types";

const locales: { code: Locale; flag: string; label: string }[] = [
  { code: "en", flag: "🇺🇸", label: "English" },
  { code: "ja", flag: "🇯🇵", label: "日本語" },
  { code: "ar", flag: "🇸🇦", label: "العربية" },
];

type LocaleFlagsProps = {
  className?: string;
};

export function LocaleFlags({ className = "" }: LocaleFlagsProps) {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      className={`flex items-center rounded-lg border border-zinc-200 bg-white p-0.5 dark:border-zinc-800 dark:bg-black ${className}`}
      role="group"
      aria-label={t.locale.label}
    >
      {locales.map((item) => (
        <button
          key={item.code}
          type="button"
          onClick={() => setLocale(item.code)}
          className={`rounded-md px-2 py-1 text-base leading-none transition-colors ${
            locale === item.code
              ? "bg-accent text-white"
              : "text-zinc-600 hover:bg-zinc-50 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-950 dark:hover:text-white"
          }`}
          aria-pressed={locale === item.code}
          aria-label={item.label}
          title={item.label}
        >
          <span aria-hidden>{item.flag}</span>
        </button>
      ))}
    </div>
  );
}
