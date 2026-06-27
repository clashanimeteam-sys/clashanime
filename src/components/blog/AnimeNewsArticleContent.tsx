"use client";

import Image from "next/image";
import Link from "next/link";
import { BlogPageShell } from "@/components/blog/BlogPageShell";
import type { AnimeNewsArticle } from "@/lib/animeNews/types";
import { getAnimeNewsCopy } from "@/lib/animeNews/types";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";

type AnimeNewsArticleContentProps = {
  article: AnimeNewsArticle;
  related: AnimeNewsArticle[];
};

export function AnimeNewsArticleContent({ article, related }: AnimeNewsArticleContentProps) {
  const { t, locale, formatDateTime } = useLocale();
  const copy = getAnimeNewsCopy(article, locale);

  usePageTitle(copy.title);

  return (
    <BlogPageShell heroCompact articleTitle={copy.title}>
      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <Link
          href="/blog/anime-news"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-orange-300"
        >
          <span aria-hidden>←</span>
          {t.blog.animeNews.backToNews}
        </Link>

        <span className="mt-6 inline-flex rounded-full bg-orange-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-200 ring-1 ring-orange-500/25">
          {t.blog.animeNews.badge}
        </span>

        <p className="mt-4 text-sm text-zinc-500">
          {t.blog.published}{" "}
          {formatDateTime(article.published_at, { dateStyle: "long" })}
          {article.source_author ? ` · ${article.source_author}` : ""}
        </p>

        {article.cover_image_url ? (
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
            <Image
              src={article.cover_image_url}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              unoptimized
            />
          </div>
        ) : null}

        {article.topics.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {article.topics.map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-semibold text-orange-200"
              >
                #{topic}
              </span>
            ))}
          </div>
        ) : null}

        {copy.excerpt ? (
          <p className="mt-6 rounded-2xl border border-zinc-700/80 bg-zinc-900/90 p-5 text-sm leading-relaxed text-zinc-200 sm:text-base">
            {copy.excerpt}
          </p>
        ) : null}

        <div className="mt-8 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{t.blog.animeNews.sourceLabel}</p>
          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-orange-300 transition hover:text-orange-200 hover:underline"
          >
            {t.blog.animeNews.readOnCrunchyroll}
            <span aria-hidden>↗</span>
          </a>
        </div>

        {related.length > 0 ? (
          <aside className="mt-12 border-t border-zinc-800 pt-8">
            <h2 className="text-base font-semibold text-white">{t.blog.animeNews.latestHeading}</h2>
            <ul className="mt-4 space-y-4">
              {related.map((item) => {
                const relatedCopy = getAnimeNewsCopy(item, locale);
                return (
                  <li key={item.id} className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4">
                    <Link
                      href={`/blog/anime-news/${item.slug}`}
                      className="font-medium text-orange-300 transition hover:text-orange-200 hover:underline"
                    >
                      {relatedCopy.title}
                    </Link>
                    <p className="mt-1 text-xs text-zinc-500">
                      {formatDateTime(item.published_at, { dateStyle: "medium" })}
                    </p>
                  </li>
                );
              })}
            </ul>
          </aside>
        ) : null}
      </article>
    </BlogPageShell>
  );
}
