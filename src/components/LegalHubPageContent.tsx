"use client";

import Link from "next/link";
import { PageBackLink } from "@/components/PageBackLink";
import { communicationLinks, informationLinks } from "@/lib/siteLinks";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";

function HubLinkCard({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm font-medium text-zinc-800 transition-colors hover:border-accent/40 hover:bg-accent/5 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-accent/50"
    >
      <span>{children}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-4 w-4 shrink-0 text-zinc-400 rtl:rotate-180"
        aria-hidden
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </Link>
  );
}

export function LegalHubPageContent() {
  const { t } = useLocale();
  usePageTitle(t.legalHub.pageTitle);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <PageBackLink href="/" label={t.common.backToHome} className="mb-4" />

      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">{t.legalHub.badge}</p>
        <h1 className="mt-2 text-2xl font-bold text-black dark:text-white sm:text-3xl">
          {t.legalHub.pageTitle}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {t.legalHub.subtitle}
        </p>
      </header>

      <section className="mb-8" aria-labelledby="legal-hub-information">
        <h2
          id="legal-hub-information"
          className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500"
        >
          {t.footer.informationHeading}
        </h2>
        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">{t.legalHub.rulesIntro}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {informationLinks.map((item) => (
            <HubLinkCard key={item.href} href={item.href}>
              {t.footer[item.key]}
            </HubLinkCard>
          ))}
        </div>
      </section>

      <section aria-labelledby="legal-hub-communication">
        <h2
          id="legal-hub-communication"
          className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500"
        >
          {t.footer.socialHeading}
        </h2>
        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">{t.legalHub.contactIntro}</p>
        <div className="grid gap-2">
          {communicationLinks.map((item) => (
            <HubLinkCard key={`${item.href}-${item.key}`} href={item.href}>
              {t.footer[item.key]}
            </HubLinkCard>
          ))}
        </div>
      </section>
    </div>
  );
}
