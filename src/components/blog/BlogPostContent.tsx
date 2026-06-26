"use client";

import Link from "next/link";
import { PageBackLink } from "@/components/PageBackLink";
import type { BlogCategory } from "@/lib/blog/types";
import { getAllBlogPosts, getBlogPostCopy } from "@/lib/blog/posts";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";

type BlogPostContentProps = {
  slug: string;
  category: BlogCategory;
  publishedAt: string;
  readingMinutes: number;
};

export function BlogPostContent({ slug, category, publishedAt, readingMinutes }: BlogPostContentProps) {
  const { t, locale, formatDateTime } = useLocale();
  const copy = getBlogPostCopy(slug, locale);

  usePageTitle(copy?.title ?? t.blog.hubTitle);

  if (!copy) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center text-zinc-500">
        {t.blog.notFound}
      </div>
    );
  }

  const related = getAllBlogPosts()
    .filter((post) => post.slug !== slug && post.category === category)
    .slice(0, 3);

  return (
    <article className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <PageBackLink href="/blog" label={t.blog.backToGuide} className="mb-4" />

      <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-800 dark:bg-orange-500/15 dark:text-orange-200">
        {t.blog.categories[category]}
      </span>

      <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-zinc-900 dark:text-white sm:text-4xl">
        {copy.title}
      </h1>

      <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
        {t.blog.published}{" "}
        {formatDateTime(publishedAt, { dateStyle: "long" })}
        {" · "}
        {t.blog.minRead.replace("{minutes}", String(readingMinutes))}
      </p>

      <p className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300">
        {copy.excerpt}
      </p>

      <div className="mt-8 space-y-8">
        {copy.sections.map((section) => (
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

      {related.length > 0 ? (
        <aside className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white">{t.blog.relatedArticles}</h2>
          <ul className="mt-4 space-y-3">
            {related.map((post) => {
              const relatedCopy = getBlogPostCopy(post.slug, locale);
              if (!relatedCopy) return null;
              return (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm font-medium text-orange-700 transition hover:underline dark:text-orange-300"
                  >
                    {relatedCopy.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/tracker"
          className="rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-md"
        >
          {t.nav.animeTracker}
        </Link>
        <Link
          href="/upload"
          className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 dark:border-zinc-700 dark:text-zinc-200"
        >
          {t.upload.title}
        </Link>
      </div>
    </article>
  );
}
