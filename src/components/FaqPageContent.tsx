"use client";

import { ContentGuidePage } from "@/components/ContentGuidePage";
import { getFaqCopy } from "@/lib/faqCopy";
import { useLocale } from "@/providers/LocaleProvider";

export function FaqPageContent() {
  const { locale, t } = useLocale();
  return (
    <ContentGuidePage
      copy={getFaqCopy(locale)}
      related={[
        { href: "/how-it-works", label: t.footer.howItWorks },
        { href: "/about", label: t.footer.about },
        { href: "/blog", label: t.footer.arenaGuide },
        { href: "/earn", label: t.nav.earnMoney },
      ]}
    />
  );
}
