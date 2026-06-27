"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { FeaturedAnimeCategory, FeaturedAnimeEntry } from "@/lib/animeNews/featuredAnimeCatalog";
import { useLocale } from "@/providers/LocaleProvider";

type FeaturedAnimeSpotlightSectionsProps = {
  catalog: FeaturedAnimeEntry[];
};

const SECTION_ORDER: FeaturedAnimeCategory[] = [
  "legends",
  "action",
  "mystery",
  "isekai",
  "sports",
  "romance",
  "classics",
];

function SpotlightCard({ entry }: { entry: FeaturedAnimeEntry }) {
  const { t } = useLocale();
  const [showVideo, setShowVideo] = useState(false);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/80 transition hover:border-orange-500/35">
      <div className="relative aspect-[2/3] bg-zinc-900">
        {entry.posterUrl ? (
          <Image
            src={entry.posterUrl}
            alt=""
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            sizes="200px"
            unoptimized
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="font-display text-sm font-bold leading-snug text-white">{entry.title}</h3>
        {entry.synopsis ? (
          <p className="mt-2 line-clamp-4 flex-1 text-xs leading-relaxed text-zinc-400">{entry.synopsis}</p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          {entry.youtubeId ? (
            <button
              type="button"
              onClick={() => setShowVideo((value) => !value)}
              className="rounded-full border border-orange-500/40 px-3 py-1 text-[11px] font-semibold text-orange-200"
            >
              {showVideo ? t.blog.animeNews.hideTrailer : t.blog.animeNews.watchTrailer}
            </button>
          ) : null}
          <Link
            href="/tracker"
            className="rounded-full border border-zinc-700 px-3 py-1 text-[11px] font-semibold text-zinc-300"
          >
            {t.blog.animeNews.watchNowCta}
          </Link>
        </div>
        {showVideo && entry.youtubeId ? (
          <div className="relative mt-3 aspect-video overflow-hidden rounded-lg bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${entry.youtubeId}`}
              title={entry.title}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function FeaturedAnimeSpotlightSections({ catalog }: FeaturedAnimeSpotlightSectionsProps) {
  const { t } = useLocale();

  if (catalog.length === 0) return null;

  const categoryLabel = (category: FeaturedAnimeCategory) => t.blog.animeNews.spotlightCategories[category];

  return (
    <div className="space-y-10">
      <div className="border-s-4 border-orange-500 ps-4">
        <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
          {t.blog.animeNews.spotlightHeading}
        </h2>
        <p className="mt-1 text-sm text-zinc-400">{t.blog.animeNews.spotlightSubtitle}</p>
      </div>

      {SECTION_ORDER.map((category) => {
        const items = catalog.filter((entry) => entry.category === category);
        if (items.length === 0) return null;

        return (
          <section key={category}>
            <h3 className="mb-4 font-display text-base font-bold text-orange-200">
              {categoryLabel(category)}
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {items.map((entry) => (
                <SpotlightCard key={entry.key} entry={entry} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
