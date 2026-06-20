"use client";

import { SectionPlaceholder } from "@/components/SectionPlaceholder";
import { useLocale } from "@/providers/LocaleProvider";

export function CommunityPageContent() {
  const { t } = useLocale();

  return (
    <SectionPlaceholder
      title={t.pages.communityTitle}
      subtitle={t.pages.communitySubtitle}
      body={t.pages.communityBody}
    />
  );
}
