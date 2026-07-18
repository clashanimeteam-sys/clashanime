"use client";

import Link from "next/link";
import { PageBackLink } from "@/components/PageBackLink";
import type { GuidePageCopy } from "@/lib/faqCopy";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";

type ContentGuidePageProps = {
  copy: GuidePageCopy;
  related?: Array<{ href: string; label: string }>;
};

export function ContentGuidePage({ copy, related = [] }: ContentGuidePageProps) {
  const { t } = useLocale();
  usePageTitle(copy.title);

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <PageBackLink href="/" label={t.common.backToHome} />
      <h1 className="mt-6 text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
        {copy.title}
      </h1>
      <p className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300">
        {copy.intro}
      </p>

      <div className="mt-8 space-y-6">
        {copy.sections.map((section) => (
          <section
            key={section.heading}
            className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950/60 sm:p-6"
          >
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{section.heading}</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              {section.body}
            </p>
          </section>
        ))}
      </div>

      <p className="mt-8 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{copy.closing}</p>

      {related.length > 0 ? (
        <nav className="mt-10 flex flex-wrap gap-3 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          {related.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-zinc-300 bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-800 transition hover:border-orange-400 hover:text-orange-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-orange-500 dark:hover:text-orange-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </article>
  );
}
