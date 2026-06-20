"use client";

import { LegalDocument } from "@/components/LegalDocument";
import { getDmcaCopy } from "@/lib/legalCopy";
import { useLocale } from "@/providers/LocaleProvider";

export function DmcaPageContent() {
  const { locale } = useLocale();
  const copy = getDmcaCopy(locale);

  return (
    <LegalDocument title={copy.title} updated={copy.updated} sections={copy.sections} />
  );
}
