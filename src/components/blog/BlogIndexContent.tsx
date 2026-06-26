"use client";

import Link from "next/link";
import { PageBackLink } from "@/components/PageBackLink";
import type { BlogCategory } from "@/lib/blog/types";
import { BLOG_CATEGORIES, getAllBlogPosts } from "@/lib/blog/posts";
import { getBlogPostCopy } from "@/lib/blog/posts";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";

function categoryLabel(category: BlogCategory, t: ReturnType<typeof useLocale>["t"]) {
  return t.blog.categories[category];
}

export function BlogIndexContent() {
  const { t, locale, formatDateTime } = useLocale();
  const posts = getAllBlogPosts();

  usePageTitle(t.blog.hubTitle);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      <PageBackLink href="/" label={t.common.backToHome} className="mb-4" />

      <header className="rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6 shadow-lg dark:border-orange-500/30 dark:from-orange-950/40 dark:via-zinc-950 dark:to-red-950/20 sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-orange-600 dark:text-orange-300">
          {t.blog.hubBadge}
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
          {t.blog.hubTitle}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
          {t.blog.hubSubtitle}
        </p>
      </header>

      {BLOG_CATEGORIES.map((category) => {
        const categoryPosts = posts.filter((post) => post.category === category);
        if (categoryPosts.length === 0) return null;

        return (
          <section key={category} className="mt-10">
            <div className="mb-4 border-s-4 border-orange-500 ps-4">
              <h2 className="font-display text-xl font-bold text-zinc-900 dark:text-white">
                {categoryLabel(category, t)}
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {t.blog.categoryHint[category]}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {categoryPosts.map((post) => {
                const copy = getBlogPostCopy(post.slug, locale);
                if (!copy) return null;

                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-orange-500/40"
                  >
                    <span className="inline-flex w-fit rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-800 dark:bg-orange-500/15 dark:text-orange-200">
                      {categoryLabel(post.category, t)}
                    </span>
                    <h3 className="mt-3 font-display text-lg font-bold leading-snug text-zinc-900 group-hover:text-orange-700 dark:text-white dark:group-hover:text-orange-200">
                      {copy.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {copy.excerpt}
                    </p>
                    <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
                      {formatDateTime(post.publishedAt, { dateStyle: "medium" })}
                      {" · "}
                      {t.blog.minRead.replace("{minutes}", String(post.readingMinutes))}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
