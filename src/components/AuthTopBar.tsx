"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { AnimeSearchButton } from "@/components/AnimeSearchButton";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitleContext } from "@/providers/PageTitleProvider";

export function AuthTopBar() {
  const { t } = useLocale();
  const pathname = usePathname();
  const { title: pageTitle } = usePageTitleContext();

  if (pathname === "/login" || pathname === "/signup" || pathname.startsWith("/auth/")) {
    return null;
  }

  const isHome = pathname === "/";

  return (
    <div className={`flex items-stretch justify-between ${isHome ? "" : "gap-3 px-4 sm:px-6"}`}>
      <div className="flex min-w-0 items-center">
        {isHome ? (
          <p className="px-4 text-xs font-semibold uppercase tracking-[0.18em] text-orange-600 dark:text-orange-300 sm:px-6">
            {t.nav.stories}
          </p>
        ) : pageTitle ? (
          <h1 className="page-corner-title">{pageTitle}</h1>
        ) : (
          <div className="md:hidden">
            <BrandMark />
          </div>
        )}
      </div>
      <div className={`flex shrink-0 items-center gap-3 py-2 ${isHome ? "px-4 sm:px-6" : ""}`}>
        <AnimeSearchButton />
      </div>
    </div>
  );
}
