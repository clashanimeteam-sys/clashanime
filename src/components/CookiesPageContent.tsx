"use client";

import { LegalDocument } from "@/components/LegalDocument";
import { getCookiePolicyCopy } from "@/lib/cookiePolicyCopy";
import { useLocale } from "@/providers/LocaleProvider";

export function CookiesPageContent() {
  const { locale } = useLocale();
  const copy = getCookiePolicyCopy(locale);

  return (
    <LegalDocument
      title={copy.title}
      updated={copy.updated}
      intro={copy.intro}
      sections={copy.sections}
    />
  );
}
