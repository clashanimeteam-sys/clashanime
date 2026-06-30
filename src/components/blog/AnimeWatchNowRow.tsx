"use client";

import Image from "next/image";
import Link from "next/link";
import type { FeaturedAnimeEntry } from "@/lib/animeNews/featuredAnimeCatalog";
import { watchNowAnimePath } from "@/lib/animeNews/watchNowPaths";
import { useLocale } from "@/providers/LocaleProvider";

type AnimeWatchNowRowProps = {
  entries: FeaturedAnimeEntry[];
  limit?: number;
  compact?: boolean;
};

function YoutubeEmbed({ youtubeId }: { youtubeId: string }) {
  return (
    <div className="relative mt-3 aspect-video overflow-hidden rounded-xl border border-zinc-800 bg-black">
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title="Anime trailer"
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export function AnimeWatchNowRow({ entries, limit = 12, compact = false }: AnimeWatchNowRowProps) {
  const { t } = useLocale();
  const items = entries.slice(0, limit);

  if (items.length === 0) return null;

  const featured = items[0];

  return (
    <section className={compact ? "space-y-3" : "space-y-4"}>
      <h2 className="font-display text-lg font-bold text-white">{t.blog.animeNews.watchNowHeading}</h2>

      {!compact && featured?.youtubeId ? <YoutubeEmbed youtubeId={featured.youtubeId} /> : null}

      <div className="flex gap-3 overflow-x-auto pb-2" data-allow-horizontal-scroll="true">
        {items.map((entry) => (
          <Link
            key={entry.key}
            href={watchNowAnimePath(entry.key)}
            className="group w-[120px] shrink-0 text-start transition hover:opacity-100"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 group-hover:border-orange-500/40">
              {entry.posterUrl ? (
                <Image
                  src={entry.posterUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="120px"
                  unoptimized
                />
              ) : null}
            </div>
            <p className="mt-2 line-clamp-2 text-xs font-semibold leading-snug text-zinc-200 group-hover:text-orange-200">
              {entry.title}
            </p>
            <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-orange-300">
              <span aria-hidden>▶</span>
              {t.blog.animeNews.watchNowCta}
            </span>
          </Link>
        ))}
      </div>

      {!compact && featured?.synopsis ? (
        <p className="text-sm leading-relaxed text-zinc-400">{featured.synopsis}</p>
      ) : null}

      <Link
        href="/blog/anime-news/watch-now"
        className="inline-flex text-xs font-semibold text-orange-300 hover:text-orange-200"
      >
        {t.blog.animeNews.openTracker}
      </Link>
    </section>
  );
}
