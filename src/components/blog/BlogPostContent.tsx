"use client";

import Link from "next/link";
import { BlogAds } from "@/components/ads/BlogAds";
import { BlogPageShell } from "@/components/blog/BlogPageShell";
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
      <BlogPageShell heroCompact articleTitle={t.blog.notFound}>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center text-zinc-400">{t.blog.notFound}</div>
      </BlogPageShell>
    );
  }

  const related = getAllBlogPosts()
    .filter((post) => post.slug !== slug && post.category === category)
    .slice(0, 3);

  return (
    <BlogPageShell heroCompact articleTitle={copy.title}>
      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-orange-300"
        >
          <span aria-hidden>←</span>
          {t.blog.backToGuide}
        </Link>

        <span className="mt-6 inline-flex rounded-full bg-orange-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-200 ring-1 ring-orange-500/25">
          {t.blog.categories[category]}
        </span>

        <p className="mt-4 text-sm text-zinc-500">
          {t.blog.published}{" "}
          {formatDateTime(publishedAt, { dateStyle: "long" })}
          {" · "}
          {t.blog.minRead.replace("{minutes}", String(readingMinutes))}
        </p>

        <p className="mt-6 rounded-2xl border border-zinc-700/80 bg-zinc-900/90 p-4 text-sm leading-relaxed text-zinc-300">
          {copy.excerpt}
        </p>

        <div className="mt-8 space-y-8">
          {copy.sections.map((section, index) => (
            <div key={section.heading}>
              <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6">
                <h2 className="text-lg font-semibold text-white">{section.heading}</h2>
                <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-zinc-300">
                  {section.body.split("\n").map((line, lineIndex) => {
                    const trimmed = line.trim();
                    if (trimmed.startsWith("•")) {
                      return (
                        <p key={`${section.heading}-${lineIndex}`} className="ms-1 ps-3">
                          {line}
                        </p>
                      );
                    }
                    if (!trimmed) return <br key={`${section.heading}-${lineIndex}`} />;
                    return <p key={`${section.heading}-${lineIndex}`}>{line}</p>;
                  })}
                </div>
              </section>
              {index === 0 ? <BlogAds variant="mid" /> : null}
            </div>
          ))}
        </div>

        {related.length > 0 ? (
          <aside className="mt-12 border-t border-zinc-800 pt-8">
            <h2 className="text-base font-semibold text-white">{t.blog.relatedArticles}</h2>
            <ul className="mt-4 space-y-3">
              {related.map((post) => {
                const relatedCopy = getBlogPostCopy(post.slug, locale);
                if (!relatedCopy) return null;
                return (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm font-medium text-orange-300 transition hover:text-orange-200 hover:underline"
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
            className="rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-900/30"
          >
            {t.nav.animeTracker}
          </Link>
          <Link
            href="/upload"
            className="rounded-full border border-zinc-600 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800"
          >
            {t.upload.title}
          </Link>
        </div>
      </article>
    </BlogPageShell>
  );
}
