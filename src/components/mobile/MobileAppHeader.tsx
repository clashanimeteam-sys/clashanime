"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { AnimeSearchButton } from "@/components/AnimeSearchButton";
import { MobileHeaderBrandTitle } from "@/components/mobile/MobileHeaderBrandTitle";
import { useLocale } from "@/providers/LocaleProvider";

export function MobileAppHeader() {
  const { locale } = useLocale();
  const isArabic = locale === "ar";

  return (
    <header
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md dark:bg-black/95 md:hidden"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="flex min-h-14 items-center justify-between gap-2 px-3 py-1.5">
        <Link
          href="/"
          dir="ltr"
          className={`order-1 flex min-w-0 items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
          aria-label="Clash Anime"
        >
          <BrandLogo className="h-[3.85rem] w-[3.85rem] shrink-0" priority />
          <MobileHeaderBrandTitle />
        </Link>

        <div className="order-2 flex shrink-0 items-center gap-1.5">
          <AnimeSearchButton />
        </div>
      </div>
      <div className="border-b border-zinc-200/80 dark:border-zinc-800/80" aria-hidden />
    </header>
  );
}
