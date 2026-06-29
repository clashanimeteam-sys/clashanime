"use client";

import Link from "next/link";
import { PageBackLink } from "@/components/PageBackLink";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";

export default function SettingsPage() {
  const { t } = useLocale();
  usePageTitle(t.nav.settings);

  return (
    <div className="mx-auto max-w-3xl bg-white px-4 py-4 dark:bg-black sm:px-6">
      <PageBackLink href="/profile" label={t.nav.myVideos} className="mb-4" />
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Theme and language controls are available in the sidebar.
      </p>
      <Link
        href="/legal"
        className="mt-6 inline-flex rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-800 transition-colors hover:border-accent hover:text-accent dark:border-zinc-800 dark:text-zinc-100"
      >
        {t.legalHub.pageTitle}
      </Link>
    </div>
  );
}
