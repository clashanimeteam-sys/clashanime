"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimeSynopsisBlock } from "@/components/tracker/AnimeSynopsisBlock";
import type { TrendingSpotlightCard } from "@/lib/animeTracker";
import {
  buildClashUploadHref,
  localizedAnimeTitle,
  localizedTrendingEditorial,
} from "@/lib/animeTracker";
import { useLocale } from "@/providers/LocaleProvider";

type TrendingSpotlightSectionProps = {
  cards: TrendingSpotlightCard[];
};

function TrendingPoster({ url, title }: { url: string | null; title: string }) {
  if (url) {
    return (
      <Image
        src={url}
        alt={title}
        width={92}
        height={130}
        className="h-[130px] w-[92px] shrink-0 rounded-2xl object-cover shadow-md ring-1 ring-black/10 dark:ring-white/10"
        unoptimized
      />
    );
  }

  return (
    <div
      className="flex h-[130px] w-[92px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-3xl shadow-md"
      aria-hidden
    >
      🔥
    </div>
  );
}

function TrendingSpotlightCardView({ card }: { card: TrendingSpotlightCard }) {
  const { t, locale, formatNumber } = useLocale();
  const title = localizedAnimeTitle(
    {
      title: card.animeTitle,
      titleAr: card.titleAr,
      titleJa: card.titleJa,
    },
    locale,
  );
  const editorial = localizedTrendingEditorial(card, locale);
  const hasClash = Boolean(card.clashId);
  const cardBody = (
    <>
      <div className="relative shrink-0 p-4 sm:p-5">
        <TrendingPoster url={card.posterUrl} title={title} />
        <span className="absolute start-6 top-6 rounded-lg bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
          #{formatNumber(card.rank)}
        </span>
        <span className="absolute end-6 top-6 rounded-lg bg-orange-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
          {t.animeTracker.trendingClashBadge}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 border-t border-orange-100 p-4 dark:border-orange-500/20 sm:border-s-0 sm:border-t-0 sm:py-5 sm:pe-5">
        <div>
          <h3 className="font-display text-xl font-bold leading-snug text-zinc-900 group-hover:text-orange-700 dark:text-white dark:group-hover:text-orange-200 sm:text-2xl">
            {title}
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            {card.malScore ? (
              <span className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                {t.animeTracker.scoreLabel.replace("{score}", formatNumber(card.malScore))}
              </span>
            ) : null}
            {card.episodesTotal ? (
              <span className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                {t.animeTracker.episodesTotalLabel.replace("{count}", formatNumber(card.episodesTotal))}
              </span>
            ) : null}
            {card.airingStatus ? (
              <span className="inline-flex rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-800 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-200">
                {card.airingStatus}
              </span>
            ) : null}
            {card.broadcastLabel ? (
              <span className="inline-flex rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
                {card.broadcastLabel}
              </span>
            ) : null}
          </div>

          {editorial ? (
            <p className="mt-3 text-sm leading-relaxed text-amber-900/90 dark:text-amber-100">{editorial}</p>
          ) : null}

          <AnimeSynopsisBlock synopsis={card} variant="compact" />

          {hasClash ? (
            <p className="mt-3 text-base font-medium text-orange-700 dark:text-orange-300">
              {t.animeTracker.clipCount.replace("{count}", formatNumber(card.clipCount))}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          {hasClash ? (
            <>
              <span className="inline-flex w-fit rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-500/30 transition group-hover:brightness-110">
                {t.animeTracker.enterClash} →
              </span>
              <Link
                href={buildClashUploadHref(card.clashId!)}
                onClick={(event) => event.stopPropagation()}
                className="inline-flex rounded-full border border-orange-300 bg-white px-5 py-2.5 text-sm font-bold text-orange-800 transition hover:bg-orange-50 dark:border-orange-500/40 dark:bg-zinc-900/60 dark:text-orange-200"
              >
                {t.animeTracker.uploadClip}
              </Link>
            </>
          ) : (
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {t.animeTracker.trendingSyncPending}
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (hasClash) {
    return (
      <Link
        href={`/tracker/clash/${card.clashId}`}
        className="group flex flex-col overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-50 shadow-lg shadow-orange-500/10 transition hover:-translate-y-0.5 hover:border-orange-400 hover:shadow-xl dark:border-orange-500/40 dark:from-orange-950/50 dark:via-zinc-950 dark:to-red-950/40 dark:shadow-orange-900/20 sm:flex-row"
      >
        {cardBody}
      </Link>
    );
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-50 shadow-lg dark:border-orange-500/40 dark:from-orange-950/50 dark:via-zinc-950 dark:to-red-950/40 sm:flex-row">
      {cardBody}
    </article>
  );
}

export function TrendingSpotlightSection({ cards }: TrendingSpotlightSectionProps) {
  const { t } = useLocale();

  if (cards.length === 0) {
    return (
      <section className="mb-12">
        <div className="mb-5 border-s-4 border-amber-500 ps-4">
          <h2 className="font-display text-lg font-bold tracking-wide text-amber-900 dark:text-amber-200 sm:text-xl">
            {t.animeTracker.trendingSpotlightTitle}
          </h2>
        </div>
        <p className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-8 text-center text-base font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300">
          {t.animeTracker.trendingSyncPending}
        </p>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="mb-5 border-s-4 border-amber-500 ps-4">
        <h2 className="font-display text-lg font-bold tracking-wide text-amber-900 dark:text-amber-200 sm:text-xl">
          {t.animeTracker.trendingSpotlightTitle}
        </h2>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {cards.map((card) => (
          <TrendingSpotlightCardView key={card.rank} card={card} />
        ))}
      </div>
    </section>
  );
}
