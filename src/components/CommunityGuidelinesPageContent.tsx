"use client";

import { LegalDocument } from "@/components/LegalDocument";
import { getCommunityCopy } from "@/lib/legalCopy";
import { useLocale } from "@/providers/LocaleProvider";

export function CommunityGuidelinesPageContent() {
  const { locale } = useLocale();
  const copy = getCommunityCopy(locale);

  return (
    <LegalDocument
      title={copy.title}
      updated={copy.updated}
      intro={copy.intro}
      sections={copy.sections}
    />
  );
}
