"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BlogPageShell } from "@/components/blog/BlogPageShell";
import type { AnimeNewsArticle } from "@/lib/animeNews/types";
import { getAnimeNewsCopy } from "@/lib/animeNews/types";
import type { BlogCategory } from "@/lib/blog/types";
import { BLOG_CATEGORIES, getAllBlogPosts, getBlogPostCopy } from "@/lib/blog/posts";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";

function categoryLabel(category: BlogCategory, t: ReturnType<typeof useLocale>["t"]) {
  return t.blog.categories[category];
}

type BlogIndexContentProps = {
  latestNews?: AnimeNewsArticle[];
};

export function BlogIndexContent({ latestNews: initialLatestNews = [] }: BlogIndexContentProps) {
  const { t, locale, formatDateTime } = useLocale();
  const posts = getAllBlogPosts();
  const [latestNews, setLatestNews] = useState<AnimeNewsArticle[]>(initialLatestNews);

  usePageTitle(t.blog.hubTitle);

  useEffect(() => {
    if (initialLatestNews.length > 0) return;

    let cancelled = false;

    void fetch("/api/anime-news/published?limit=3")
      .then((response) => (response.ok ? response.json() : { articles: [] }))
      .then((payload: { articles?: AnimeNewsArticle[] }) => {
        if (!cancelled) {
          setLatestNews(payload.articles ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) setLatestNews([]);
      });

    return () => {
      cancelled = true;
    };
  }, [initialLatestNews.length]);

  return (
    <BlogPageShell>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        {latestNews.length > 0 ? (
          <section id="anime-news" className="mb-12 scroll-mt-28">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-s-4 border-orange-500 ps-4">
              <div>
                <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
                  {t.blog.animeNews.hubTitle}
                </h2>
                <p className="mt-1 text-sm text-zinc-400">{t.blog.animeNews.hubSubtitle}</p>
              </div>
              <Link
                href="/blog/anime-news"
                className="rounded-full border border-orange-500/35 bg-black/40 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-orange-200 transition hover:bg-orange-500/10"
              >
                {t.blog.animeNews.viewAll}
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {latestNews.map((article) => {
                const copy = getAnimeNewsCopy(article, locale);
                return (
                  <Link
                    key={article.id}
                    href={`/blog/anime-news/${article.slug}`}
                    className="group overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-900/95 transition hover:border-orange-500/50"
                  >
                    <div className="relative aspect-[16/10] bg-zinc-950">
                      {article.cover_image_url ? (
                        <Image
                          src={article.cover_image_url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="320px"
                          unoptimized
                        />
                      ) : null}
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-sm font-bold leading-snug text-white group-hover:text-orange-200">
                        {copy.title}
                      </h3>
                      <p className="mt-2 text-xs text-zinc-500">
                        {formatDateTime(article.published_at, { dateStyle: "medium" })}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}
        {BLOG_CATEGORIES.map((category) => {
          const categoryPosts = posts.filter((post) => post.category === category);
          if (categoryPosts.length === 0) return null;

          return (
            <section key={category} id={category} className="mb-12 scroll-mt-28 last:mb-0">
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
