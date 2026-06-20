"use client";

import { LegalDocument } from "@/components/LegalDocument";
import { getTermsCopy } from "@/lib/legalCopy";
import { useLocale } from "@/providers/LocaleProvider";

export function TermsPageContent() {
  const { locale } = useLocale();
  const copy = getTermsCopy(locale);

  return (
    <LegalDocument title={copy.title} updated={copy.updated} sections={copy.sections} />
  );
}
