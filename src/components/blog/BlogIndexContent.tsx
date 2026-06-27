"use client";

import Link from "next/link";
import { BlogPageShell } from "@/components/blog/BlogPageShell";
import type { BlogCategory } from "@/lib/blog/types";
import { BLOG_CATEGORIES, getAllBlogPosts, getBlogPostCopy } from "@/lib/blog/posts";
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
    <BlogPageShell>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        {BLOG_CATEGORIES.map((category) => {
          const categoryPosts = posts.filter((post) => post.category === category);
          if (categoryPosts.length === 0) return null;

          return (
            <section key={category} className="mb-12 last:mb-0">
              <div className="mb-5 border-s-4 border-orange-500 ps-4">
                <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
                  {categoryLabel(category, t)}
                </h2>
                <p className="mt-1 text-sm text-zinc-400">{t.blog.categoryHint[category]}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {categoryPosts.map((post) => {
                  const copy = getBlogPostCopy(post.slug, locale);
                  if (!copy) return null;

                  return (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col rounded-2xl border border-zinc-700/80 bg-zinc-900/95 p-5 shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:border-orange-500/50 hover:bg-zinc-900 hover:shadow-orange-950/20"
                    >
                      <span className="inline-flex w-fit rounded-full bg-orange-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-200 ring-1 ring-orange-500/25">
                        {categoryLabel(post.category, t)}
                      </span>
                      <h3 className="mt-3 font-display text-lg font-bold leading-snug text-white group-hover:text-orange-200">
                        {copy.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-300">
                        {copy.excerpt}
                      </p>
                      <p className="mt-4 text-xs text-zinc-500">
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
    </BlogPageShell>
  );
}
