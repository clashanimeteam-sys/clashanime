"use client";

import Link from "next/link";
import { AnimeWatchNowRow } from "@/components/blog/AnimeWatchNowRow";
import { BlogPageShell } from "@/components/blog/BlogPageShell";
import { FeaturedAnimeSpotlightSections } from "@/components/blog/FeaturedAnimeSpotlightSections";
import type { FeaturedAnimeEntry } from "@/lib/animeNews/featuredAnimeCatalog";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";

type AnimeWatchNowPageContentProps = {
  catalog: FeaturedAnimeEntry[];
};

export function AnimeWatchNowPageContent({ catalog }: AnimeWatchNowPageContentProps) {
  const { t } = useLocale();

  usePageTitle(t.blog.animeNews.watchNowHeading);

  return (
    <BlogPageShell heroCompact articleTitle={t.blog.animeNews.watchNowHeading}>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="mb-8 border-s-4 border-orange-500 ps-4">
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
            {t.blog.animeNews.watchNowHeading}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            {t.blog.animeNews.watchNowPageSubtitle}
          </p>
        </div>

        {catalog.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-6 py-12 text-center text-zinc-400">
            {t.blog.animeNews.watchNowEmpty}
          </div>
        ) : (
          <div className="space-y-12">
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/80 p-5 sm:p-6">
              <AnimeWatchNowRow entries={catalog} />
            </div>

            <FeaturedAnimeSpotlightSections catalog={catalog} />
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-center">
          <Link
            href="/blog/anime-news"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-orange-300"
          >
            <span aria-hidden>←</span>
            {t.blog.animeNews.backToNews}
          </Link>
          <Link
            href="/tracker"
            className="inline-flex rounded-full border border-orange-500/35 bg-black/40 px-4 py-2 text-xs font-bold uppercase tracking-wide text-orange-200 transition hover:bg-orange-500/10"
          >
            {t.blog.animeNews.openTrackerPage}
          </Link>
        </div>
      </div>
    </BlogPageShell>
  );
}
