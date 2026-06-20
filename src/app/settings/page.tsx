"use client";

import { useLocale } from "@/providers/LocaleProvider";

export default function SettingsPage() {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-3xl bg-white px-4 py-8 dark:bg-black sm:px-6">
      <h1 className="text-3xl font-bold text-foreground">{t.nav.settings}</h1>
      <p className="mt-3 text-sm text-muted">
        Theme and language controls are available in the sidebar.
      </p>
    </div>
  );
}
