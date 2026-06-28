"use client";

import Link from "next/link";
import { SiteErrorScreen } from "@/components/SiteErrorScreen";
import { usePageTitle } from "@/providers/PageTitleProvider";
import { useLocale } from "@/providers/LocaleProvider";

export default function NotFound() {
  const { t } = useLocale();
  usePageTitle(t.common.pageNotFoundTitle);

  return (
    <SiteErrorScreen
      title={t.common.pageNotFoundBadge}
      description={t.common.pageNotFoundDesc}
      actions={
        <Link
          href="/"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          {t.common.backToHome}
        </Link>
      }
    />
  );
}
