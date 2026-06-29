"use client";

import Link from "next/link";
import { PageBackLink } from "@/components/PageBackLink";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";

type LegalDocumentProps = {
  title: string;
  updated: string;
  intro?: string;
  sections: Array<{ heading: string; body: string }>;
};

const RELATED_LINKS = [
  { href: "/privacy", key: "privacy" as const },
  { href: "/cookies", key: "cookies" as const },
  { href: "/disclaimer", key: "disclaimer" as const },
  { href: "/eula", key: "eula" as const },
  { href: "/terms", key: "terms" as const },
  { href: "/community-guidelines", key: "communityGuidelines" as const },
  { href: "/dmca", key: "dmca" as const },
  { href: "/report", key: "reportContent" as const },
];

export function LegalDocument({ title, updated, intro, sections }: LegalDocumentProps) {
  const { t } = useLocale();
  usePageTitle(title);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <PageBackLink href="/legal" label={t.legalHub.pageTitle} className="mb-4" />
      <p className="text-xs text-zinc-500">{updated}</p>

      {intro ? (
        <p className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300">
          {intro}
        </p>
      ) : null}

      <nav className="mt-6 flex flex-wrap gap-2 text-xs">
        {RELATED_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border border-zinc-300 px-3 py-1 text-zinc-600 transition-colors hover:border-accent hover:text-accent dark:border-zinc-700 dark:text-zinc-400"
          >
            {t.footer[link.key]}
          </Link>
        ))}
      </nav>

      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-semibold text-black dark:text-white">{section.heading}</h2>
            <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {section.body.split("\n").map((line, index) => {
                const trimmed = line.trim();
                if (trimmed.startsWith("•")) {
                  return (
                    <p key={`${section.heading}-${index}`} className="ms-1 ps-3">
                      {line}
                    </p>
                  );
                }
                if (!trimmed) return <br key={`${section.heading}-${index}`} />;
                return <p key={`${section.heading}-${index}`}>{line}</p>;
              })}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-10 border-t border-zinc-200 pt-6 text-xs text-zinc-500 dark:border-zinc-800">
        {t.footer.privacy} · {t.footer.cookies} · {t.footer.disclaimer} · {t.footer.eula} ·{" "}
        {t.footer.terms} ·{" "}
        {t.footer.communityGuidelines} ·{" "}
        {t.footer.dmca} · {t.footer.reportContent}
      </p>
    </div>
  );
}
