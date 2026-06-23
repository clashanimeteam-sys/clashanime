"use client";

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
    </div>
  );
}
