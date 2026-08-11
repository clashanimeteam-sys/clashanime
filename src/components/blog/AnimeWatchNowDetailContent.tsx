"use client";

import Image from "next/image";
import Link from "next/link";
import type { FeaturedAnimeEntry } from "@/lib/animeNews/featuredAnimeCatalog";
import { BlogPageShell } from "@/components/blog/BlogPageShell";
import { publicWatchAnimeUrl, publicWatchHomeUrl } from "@/lib/watchSiteLinks";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";

type AnimeWatchNowDetailContentProps = {
  entry: FeaturedAnimeEntry;
};

function TrailerEmbed({ youtubeId, title }: { youtubeId: string; title: string }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-lg shadow-black/40">
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title={title}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export function AnimeWatchNowDetailContent({ entry }: AnimeWatchNowDetailContentProps) {
  const { t } = useLocale();

  usePageTitle(entry.title);

  const categoryLabel = t.blog.animeNews.spotlightCategories[entry.category];
  const watchHref = entry.malId ? publicWatchAnimeUrl(entry.malId) : publicWatchHomeUrl();

  return (
    <BlogPageShell heroCompact articleTitle={entry.title}>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-orange-300"
        >
          <span aria-hidden>←</span>
          {t.footer.arenaGuide}
        </Link>

        <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,220px)_1fr] md:items-start">
          <div className="relative mx-auto aspect-[2/3] w-full max-w-[220px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/30">
            {entry.posterUrl ? (
              <Image
                src={entry.posterUrl}
                alt=""
                fill
                className="object-cover"
                sizes="220px"
                priority
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950" />
            )}
          </div>

          <div className="min-w-0">
            <span className="inline-flex rounded-full bg-orange-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-orange-200 ring-1 ring-orange-500/25">
              {categoryLabel}
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              {entry.title}
            </h1>
            <a
              href={watchHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-950/40 transition hover:bg-orange-400"
            >
              <span aria-hidden>▶</span>
              {t.blog.animeNews.watchNowCta}
            </a>
          </div>
        </div>

        {entry.synopsis ? (
          <section className="mt-10 rounded-2xl border border-zinc-800/80 bg-zinc-950/80 p-5 sm:p-6">
            <h2 className="font-display text-xl font-bold text-white">{t.blog.animeNews.watchNowStoryHeading}</h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">{entry.synopsis}</p>
          </section>
        ) : null}

        {entry.youtubeId ? (
          <section className="mt-10">
            <h2 className="mb-4 font-display text-xl font-bold text-white">{t.blog.animeNews.watchNowTrailerHeading}</h2>
            <TrailerEmbed youtubeId={entry.youtubeId} title={entry.title} />
          </section>
        ) : null}

        <div className="mt-10">
          <a
            href={watchHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full border border-orange-500/35 bg-black/40 px-4 py-2 text-xs font-bold uppercase tracking-wide text-orange-200 transition hover:bg-orange-500/10"
          >
            {t.blog.animeNews.watchNowCta} — Watch Clash Anime
          </a>
        </div>
      </div>
    </BlogPageShell>
  );
}
