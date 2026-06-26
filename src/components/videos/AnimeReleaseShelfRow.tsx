"use client";

import Image from "next/image";
import Link from "next/link";
import type { AnimeRelease, AnimeReleaseUpcoming } from "@/lib/animeTracker";
import { localizedAnimeTitle } from "@/lib/animeTracker";
import { useLocale } from "@/providers/LocaleProvider";

type AnimeShelfItem = Pick<
  AnimeRelease | AnimeReleaseUpcoming,
  | "id"
  | "title"
  | "titleAr"
  | "titleJa"
  | "posterUrl"
  | "episodeNumber"
  | "releaseDate"
> & {
  clashId?: string | null;
};

type AnimeReleaseShelfRowProps = {
  title: string;
  releases: AnimeShelfItem[];
  badge?: string;
  emptyMessage?: string;
};

function releaseHref(release: AnimeShelfItem): string {
  if (release.clashId) return `/tracker/clash/${release.clashId}`;
  return "/tracker";
}

export function AnimeReleaseShelfRow({
  title,
  releases,
  badge,
  emptyMessage,
}: AnimeReleaseShelfRowProps) {
  const { t, locale, formatDateTime } = useLocale();

  if (releases.length === 0) {
    return emptyMessage ? (
      <section className="mb-10">
        <h2 className="mb-3 px-1 font-display text-lg font-bold text-zinc-900 dark:text-white sm:text-xl">
          {title}
        </h2>
        <p className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400">
          {emptyMessage}
        </p>
      </section>
    ) : null;
  }

  return (
    <section className="mb-10" aria-label={title}>
      <h2 className="mb-3 px-1 font-display text-lg font-bold text-zinc-900 dark:text-white sm:text-xl">
        {title}
      </h2>
      <div className="video-shelf-scroll -mx-1 flex gap-3 overflow-x-auto px-1 pb-2 snap-x snap-mandatory">
        {releases.map((release) => {
          const localizedTitle = localizedAnimeTitle(
            {
              title: release.title,
              titleAr: release.titleAr,
              titleJa: release.titleJa,
            },
            locale,
          );

          return (
            <Link
              key={release.id}
              href={releaseHref(release)}
              className="group w-[108px] shrink-0 snap-start sm:w-[120px]"
            >
              <div className="relative overflow-hidden rounded-xl shadow-md ring-1 ring-black/10 transition group-hover:-translate-y-0.5 group-hover:shadow-lg dark:ring-white/10">
                {release.posterUrl ? (
                  <Image
                    src={release.posterUrl}
                    alt={localizedTitle}
                    width={120}
                    height={170}
                    className="aspect-[2/3] w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex aspect-[2/3] w-full items-center justify-center bg-gradient-to-br from-violet-600 to-fuchsia-700 text-3xl">
                    📡
                  </div>
                )}
                {badge ? (
                  <span className="absolute start-2 top-2 rounded-md bg-black/75 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                    {badge}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 line-clamp-2 text-xs font-semibold leading-snug text-zinc-900 group-hover:text-accent dark:text-white">
                {localizedTitle}
              </p>
              <p className="mt-0.5 text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                {t.animeTracker.episodeLabel.replace("{episode}", String(release.episodeNumber))}
                {" · "}
                {formatDateTime(release.releaseDate, { dateStyle: "medium" })}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
