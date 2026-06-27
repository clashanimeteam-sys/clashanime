"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SeasonalLineupGrid } from "@/components/blog/SeasonalLineupGrid";
import type { SeasonalLineupEntry } from "@/lib/animeNews/seasonalLineupTypes";
import { FEATURED_SEASONAL_GUIDE, featuredGuideToArticle } from "@/lib/animeNews/seasonalGuide";
import type { AnimeNewsArticle } from "@/lib/animeNews/types";
import { getAnimeNewsCopy } from "@/lib/animeNews/types";
import { useLocale } from "@/providers/LocaleProvider";

export function BlogSeasonalGuideSpotlight() {
  const { t, locale, formatDateTime } = useLocale();
  const [article, setArticle] = useState<AnimeNewsArticle>(() => featuredGuideToArticle());
  const [lineup, setLineup] = useState<SeasonalLineupEntry[]>([]);
  const [lineupLoading, setLineupLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void fetch("/api/anime-news/featured")
      .then((response) => (response.ok ? response.json() : { article: null }))
      .then((payload: { article?: AnimeNewsArticle | null }) => {
        if (!cancelled && payload.article) {
          setArticle(payload.article);
        }
      })
      .catch(() => {
        /* keep static fallback */
      });

    void fetch("/api/anime-news/lineup")
      .then((response) => (response.ok ? response.json() : { lineup: [] }))
      .then((payload: { lineup?: SeasonalLineupEntry[] }) => {
        if (!cancelled) {
          setLineup(payload.lineup ?? []);
          setLineupLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLineupLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const copy = getAnimeNewsCopy(article, locale);

  const storyPreview =
    copy.story
      ?.split(/\n{2,}/)
      .slice(0, 2)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean) ?? [];

  return (
    <section id="seasonal-guide" className="mb-12 scroll-mt-28">
      <div className="mb-5 border-s-4 border-orange-500 ps-4">
        <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
          {t.blog.seasonalGuide.hubTitle}
        </h2>
        <p className="mt-1 text-sm text-zinc-400">{t.blog.seasonalGuide.hubSubtitle}</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-orange-500/25 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black shadow-2xl shadow-black/50">
        <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <div className="relative min-h-[220px] bg-zinc-950 lg:min-h-[420px]">
            {article.cover_image_url ? (
              <>
                <Image
                  src={article.cover_image_url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-zinc-950/10 lg:to-zinc-950/90" />
              </>
            ) : null}
            <span className="absolute start-4 top-4 rounded-full bg-orange-500/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
              {t.blog.seasonalGuide.badge}
            </span>
          </div>

          <div className="flex flex-col p-5 sm:p-7 lg:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-orange-300/90">
              {t.blog.seasonalGuide.sourceNote}
            </p>

            <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
              {copy.title}
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              {formatDateTime(article.published_at, { dateStyle: "long" })}
            </p>

            {copy.excerpt ? (
              <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">{copy.excerpt}</p>
            ) : null}

            {storyPreview.length > 0 ? (
              <div className="mt-5 space-y-3 rounded-2xl border border-zinc-800/80 bg-black/30 p-4">
                <h4 className="font-display text-sm font-bold text-orange-200">
                  {t.blog.animeNews.storyHeading}
                </h4>
                {storyPreview.map((paragraph, index) => (
                  <p key={index} className="text-sm leading-relaxed text-zinc-400">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/blog/anime-news/${article.slug}`}
                className="inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-400"
              >
                {t.blog.seasonalGuide.readFullGuide}
              </Link>
              <a
                href={article.source_url || FEATURED_SEASONAL_GUIDE.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-zinc-600 bg-zinc-900/80 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-orange-500/40 hover:text-orange-200"
              >
                {t.blog.animeNews.readOnCrunchyroll}
              </a>
            </div>
          </div>
        </div>

        {lineupLoading ? (
          <div className="border-t border-orange-500/15 bg-black/40 p-8 text-center text-sm text-zinc-500">
            {t.blog.seasonalGuide.lineupLoading}
          </div>
        ) : lineup.length > 0 ? (
          <div className="border-t border-orange-500/15 bg-black/40 p-5 sm:p-7">
            <SeasonalLineupGrid entries={lineup} compact maxItems={20} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
