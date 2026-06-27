"use client";

import Image from "next/image";
import Link from "next/link";
import { BlogPageShell } from "@/components/blog/BlogPageShell";
import type { AnimeNewsArticle } from "@/lib/animeNews/types";
import { getAnimeNewsCopy } from "@/lib/animeNews/types";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";

type AnimeNewsIndexContentProps = {
  articles: AnimeNewsArticle[];
};

export function AnimeNewsIndexContent({ articles }: AnimeNewsIndexContentProps) {
  const { t, locale, formatDateTime } = useLocale();

  usePageTitle(t.blog.animeNews.hubTitle);

  return (
    <BlogPageShell>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="mb-10 border-s-4 border-orange-500 ps-4">
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
            {t.blog.animeNews.hubTitle}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            {t.blog.animeNews.hubSubtitle}
          </p>
          <p className="mt-3 text-xs text-zinc-500">{t.blog.animeNews.sourceNote}</p>
        </div>

        {articles.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-6 py-12 text-center text-zinc-400">
            {t.blog.animeNews.empty}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
              const copy = getAnimeNewsCopy(article, locale);

              return (
                <Link
                  key={article.id}
                  href={`/blog/anime-news/${article.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-900/95 shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:border-orange-500/50 hover:shadow-orange-950/20"
                >
                  <div className="relative aspect-[16/9] bg-zinc-950">
                    {article.cover_image_url ? (
                      <Image
                        src={article.cover_image_url}
                        alt=""
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 640px) 100vw, 400px"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap gap-1.5">
                      {article.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-200 ring-1 ring-orange-500/20"
                        >
                          #{topic}
                        </span>
                      ))}
                    </div>

                    <h2 className="mt-3 font-display text-lg font-bold leading-snug text-white group-hover:text-orange-200">
                      {copy.title}
                    </h2>

                    {copy.excerpt ? (
                      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-300">
                        {copy.excerpt}
                      </p>
                    ) : null}

                    <p className="mt-4 text-xs text-zinc-500">
                      {formatDateTime(article.published_at, { dateStyle: "medium" })}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-orange-300"
          >
            <span aria-hidden>←</span>
            {t.blog.backToGuide}
          </Link>
        </div>
      </div>
    </BlogPageShell>
  );
}
