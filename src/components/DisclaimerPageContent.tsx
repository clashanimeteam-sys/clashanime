"use client";

import { LegalDocument } from "@/components/LegalDocument";
import { getDisclaimerCopy } from "@/lib/disclaimerPolicyCopy";
import { useLocale } from "@/providers/LocaleProvider";

export function DisclaimerPageContent() {
  const { locale } = useLocale();
  const copy = getDisclaimerCopy(locale);

  return (
    <LegalDocument
      title={copy.title}
      updated={copy.updated}
      intro={copy.intro}
      sections={copy.sections}
    />
  );
}
