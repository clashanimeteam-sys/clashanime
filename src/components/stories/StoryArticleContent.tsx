"use client";

import Link from "next/link";
import { PageBackLink } from "@/components/PageBackLink";
import { getStoryArticle } from "@/lib/storiesLibrary";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";

export function StoryArticleContent({ slug }: { slug: string }) {
  const { locale, formatDateTime, t } = useLocale();
  const article = getStoryArticle(slug);
  const copy = article ? article.locales[locale] ?? article.locales.en : null;

  usePageTitle(copy?.title ?? "Story");

  if (!article || !copy) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm text-zinc-500">Not found</p>
        <Link href="/stories" className="mt-4 inline-block text-orange-600">
          {t.common.backToHome}
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <PageBackLink href="/stories" label={locale === "ar" ? "كل القصص" : "All stories"} />
      <p className="mt-6 text-xs text-zinc-500">
        {formatDateTime(article.publishedAt, { dateStyle: "medium" })} · {article.readingMinutes} min
      </p>
      <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
        {copy.title}
      </h1>
      <p className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300">
        {copy.excerpt}
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
    </article>
  );
}
