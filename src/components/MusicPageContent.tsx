"use client";

import { SectionPlaceholder } from "@/components/SectionPlaceholder";
import { useLocale } from "@/providers/LocaleProvider";

export function MusicPageContent() {
  const { t } = useLocale();

  return (
    <SectionPlaceholder
      title={t.pages.musicTitle}
      subtitle={t.pages.musicSubtitle}
      body={t.pages.musicBody}
    />
  );
}
