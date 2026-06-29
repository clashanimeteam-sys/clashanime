"use client";

import { ElementalSiteTitle } from "@/components/ElementalSiteTitle";
import { useLocale } from "@/providers/LocaleProvider";

export function MobileHeaderBrandTitle() {
  const { locale, t } = useLocale();

  if (locale === "ar") {
    return (
      <span
        dir="rtl"
        className="mobile-header-arabic-brand inline-flex items-baseline gap-1 whitespace-nowrap font-display text-[1.35rem] font-black leading-none"
        aria-label={t.mobileApp.brandTitle}
      >
        <span className="bg-gradient-to-br from-brand via-red-600 to-orange-500 bg-clip-text text-transparent">
          {t.mobileApp.brandWordClash}
        </span>
        <span className="text-black dark:text-white">{t.mobileApp.brandWordAnime}</span>
      </span>
    );
  }

  return (
    <ElementalSiteTitle
      primary={t.home.titlePrimary}
      secondary={t.home.titleSecondary}
      variant="mobile-header"
    />
  );
}
