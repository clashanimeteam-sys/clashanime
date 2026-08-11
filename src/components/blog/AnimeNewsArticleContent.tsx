"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimeNewsTopSidebar } from "@/components/blog/AnimeNewsTopSidebar";
import { AnimeWatchNowRow } from "@/components/blog/AnimeWatchNowRow";
import { BlogPageShell } from "@/components/blog/BlogPageShell";
import { SeasonalLineupGrid } from "@/components/blog/SeasonalLineupGrid";
import type { FeaturedAnimeEntry } from "@/lib/animeNews/featuredAnimeCatalog";
import { FEATURED_SEASONAL_GUIDE_SLUG } from "@/lib/animeNews/seasonalGuide";
import type { SeasonalLineupEntry } from "@/lib/animeNews/seasonalLineupTypes";
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
  const isSeasonalGuide = article.slug === FEATURED_SEASONAL_GUIDE_SLUG;
  const [lineup, setLineup] = useState<SeasonalLineupEntry[]>([]);
  const [spotlight, setSpotlight] = useState<FeaturedAnimeEntry[]>([]);

  useEffect(() => {
    if (!isSeasonalGuide) return;

    let cancelled = false;
    void fetch("/api/anime-news/lineup")
      .then((response) => (response.ok ? response.json() : { lineup: [] }))
      .then((payload: { lineup?: SeasonalLineupEntry[] }) => {
        if (!cancelled) setLineup(payload.lineup ?? []);
      })
      .catch(() => {
        /* optional grid */
      });

    return () => {
      cancelled = true;
    };
  }, [isSeasonalGuide]);

  useEffect(() => {
    let cancelled = false;

    void fetch("/api/anime-news/spotlight")
      .then((response) => (response.ok ? response.json() : { catalog: [] }))
      .then((payload: { catalog?: FeaturedAnimeEntry[] }) => {
        if (!cancelled) setSpotlight(payload.catalog ?? []);
      })
      .catch(() => {
        /* optional spotlight */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  usePageTitle(copy.title);

  return (
    <BlogPageShell heroCompact articleTitle={copy.title}>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <Link
          href="/blog/anime-news"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-orange-300"
        >
          <span aria-hidden>←</span>
          {t.blog.animeNews.backToNews}
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="min-w-0">
            <span className="inline-flex rounded-full bg-orange-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-200 ring-1 ring-orange-500/25">
              {t.blog.animeNews.badge}
            </span>

            <h1 className="mt-4 font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
              {copy.title}
            </h1>

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
              <p className="mt-6 text-base leading-relaxed text-zinc-300 sm:text-lg">{copy.excerpt}</p>
            ) : null}

            {copy.story ? (
              <section className="mt-8 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6">
                <h2 className="font-display text-lg font-bold text-white sm:text-xl">
                  {t.blog.animeNews.storyHeading}
                </h2>
                <div className="mt-4 space-y-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
                  {copy.story.split(/\n{2,}/).map((paragraph, index) => (
                    <p key={index}>{paragraph.trim()}</p>
                  ))}
                </div>
              </section>
            ) : null}

            {isSeasonalGuide && lineup.length > 0 ? (
              <section className="mt-8 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6">
                <SeasonalLineupGrid entries={lineup} showFullStory />
              </section>
            ) : null}

            <div className="mt-8 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                {t.blog.animeNews.sourceLabel}
              </p>
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
          </article>

          <aside className="anime-news-sidebar-column space-y-6 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-6rem)] lg:self-start lg:overflow-y-auto lg:overscroll-y-contain lg:pr-1">
            {related.length > 0 ? (
              <AnimeNewsTopSidebar
                articles={related}
                limit={5}
                heading={t.blog.animeNews.relatedHeading}
              />
            ) : null}

            {spotlight.length > 0 ? (
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/80 p-4 sm:p-5">
                <AnimeWatchNowRow entries={spotlight} limit={10} />
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </BlogPageShell>
  );
}
