"use client";

import { LegalDocument } from "@/components/LegalDocument";
import { getPrivacyCopy } from "@/lib/legalCopy";
import { useLocale } from "@/providers/LocaleProvider";

export function PrivacyPageContent() {
  const { locale } = useLocale();
  const copy = getPrivacyCopy(locale);

  return (
    <LegalDocument
      title={copy.title}
      updated={copy.updated}
      intro={copy.intro}
      sections={copy.sections}
    />
  );
}
