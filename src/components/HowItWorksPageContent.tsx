"use client";

import { ContentGuidePage } from "@/components/ContentGuidePage";
import { getHowItWorksCopy } from "@/lib/howItWorksCopy";
import { useLocale } from "@/providers/LocaleProvider";

export function HowItWorksPageContent() {
  const { locale, t } = useLocale();
  return (
    <ContentGuidePage
      copy={getHowItWorksCopy(locale)}
      related={[
        { href: "/faq", label: t.footer.faq },
        { href: "/about", label: t.footer.about },
        { href: "/blog/start-your-first-clash", label: t.footer.arenaGuide },
        { href: "/community-guidelines", label: t.footer.communityGuidelines },
      ]}
    />
  );
}
