"use client";

import { LegalDocument } from "@/components/LegalDocument";
import { getEulaCopy } from "@/lib/eulaPolicyCopy";
import { useLocale } from "@/providers/LocaleProvider";

export function EulaPageContent() {
  const { locale } = useLocale();
  const copy = getEulaCopy(locale);

  return (
    <LegalDocument
      title={copy.title}
      updated={copy.updated}
      intro={copy.intro}
      sections={copy.sections}
    />
  );
}
