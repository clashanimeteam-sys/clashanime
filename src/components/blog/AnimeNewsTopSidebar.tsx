"use client";

import Image from "next/image";
import Link from "next/link";
import type { AnimeNewsArticle } from "@/lib/animeNews/types";
import { getAnimeNewsCopy } from "@/lib/animeNews/types";
import { useLocale } from "@/providers/LocaleProvider";

type AnimeNewsTopSidebarProps = {
  articles: AnimeNewsArticle[];
  limit?: number;
  heading?: string;
};

export function AnimeNewsTopSidebar({ articles, limit = 6, heading }: AnimeNewsTopSidebarProps) {
  const { t, locale, formatDateTime } = useLocale();
  const items = articles.slice(0, limit);
  const title = heading ?? t.blog.animeNews.topNewsHeading;

  if (items.length === 0) return null;

  return (
    <aside className="rounded-2xl border border-zinc-800/80 bg-zinc-950/80 p-4 sm:p-5">
      <h2 className="font-display text-lg font-bold text-white">{title}</h2>
      <ul className="mt-4 space-y-4">
        {items.map((article) => {
          const copy = getAnimeNewsCopy(article, locale);
          return (
            <li key={article.id}>
              <Link
                href={`/blog/anime-news/${article.slug}`}
                className="group flex gap-3 rounded-xl border border-transparent p-1 transition hover:border-zinc-800 hover:bg-zinc-900/60"
              >
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-zinc-900">
                  {article.cover_image_url ? (
                    <Image
                      src={article.cover_image_url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="96px"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-flex rounded-full bg-orange-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-orange-200">
                    {t.blog.animeNews.badge}
                  </span>
                  <p className="mt-1 line-clamp-3 text-sm font-semibold leading-snug text-zinc-100 group-hover:text-orange-200">
                    {copy.title}
                  </p>
                  <p className="mt-1 text-[11px] text-zinc-500">
                    {formatDateTime(article.published_at, { dateStyle: "medium" })}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
