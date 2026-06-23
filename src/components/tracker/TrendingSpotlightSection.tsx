"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimeSynopsisBlock } from "@/components/tracker/AnimeSynopsisBlock";
import { MatchTagUsageBadges } from "@/components/tracker/MatchTagUsageBadges";
import type { TrendingSpotlightCard } from "@/lib/animeTracker";
import {
  buildClashUploadHref,
  buildMatchTagsFromTitle,
  localizedAnimeTitle,
  localizedTrendingEditorial,
} from "@/lib/animeTracker";
import { useLocale } from "@/providers/LocaleProvider";

type TrendingSpotlightSectionProps = {
  cards: TrendingSpotlightCard[];
};

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
  const matchTags =
    card.matchTags.length > 0 ? card.matchTags : buildMatchTagsFromTitle(title);

  return (
    <article className="overflow-hidden rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6 shadow-lg dark:border-orange-500/30 dark:from-orange-950/50 dark:via-zinc-950 dark:to-red-950/30 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {card.posterUrl ? (
          <Image
            src={card.posterUrl}
            alt={title}
            width={120}
            height={170}
            className="h-[170px] w-[120px] shrink-0 rounded-2xl object-cover shadow-xl ring-1 ring-black/10 dark:ring-white/10"
            unoptimized
          />
        ) : (
          <div className="flex h-[170px] w-[120px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-4xl shadow-xl">
            🔥
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-lg bg-amber-500 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
              #{formatNumber(card.rank)} · {t.animeTracker.trendingClashBadge}
            </span>
            {card.malScore ? (
              <span className="rounded-xl border border-orange-200 bg-white px-3 py-1 text-xs font-bold text-orange-800 dark:border-orange-500/40 dark:bg-zinc-900/60 dark:text-orange-200">
                {t.animeTracker.scoreLabel.replace("{score}", formatNumber(card.malScore))}
              </span>
            ) : null}
            {card.episodesTotal ? (
              <span className="rounded-xl border border-zinc-200 bg-white px-3 py-1 text-xs font-bold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-200">
                {t.animeTracker.episodesTotalLabel.replace("{count}", formatNumber(card.episodesTotal))}
              </span>
            ) : null}
          </div>

          <h3 className="mt-4 font-display text-2xl font-bold leading-tight text-zinc-900 dark:text-white sm:text-3xl">
            {title}
          </h3>

          {card.broadcastLabel || card.airingStatus ? (
            <p className="mt-2 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
              {[card.airingStatus, card.broadcastLabel].filter(Boolean).join(" · ")}
            </p>
          ) : null}

          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-700 dark:text-orange-100">
            {t.animeTracker.clashSubtitle}
          </p>

          {editorial ? (
            <p className="mt-3 text-sm leading-relaxed text-amber-900/90 dark:text-amber-100">{editorial}</p>
          ) : null}

          <AnimeSynopsisBlock synopsis={card} variant="compact" />

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="rounded-xl border border-orange-200 bg-white px-4 py-2 text-sm font-bold text-orange-800 dark:border-orange-500/40 dark:bg-zinc-900/60 dark:text-orange-200">
              {t.animeTracker.clipCount.replace("{count}", formatNumber(card.clipCount))}
            </span>
            {hasClash ? (
              <>
                <Link
                  href={buildClashUploadHref(card.clashId!)}
                  className="rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-500/30 transition hover:brightness-110"
                >
                  {t.animeTracker.uploadClip}
                </Link>
                <Link
                  href={`/tracker/clash/${card.clashId}`}
                  className="rounded-full border border-orange-300 bg-white px-5 py-2.5 text-sm font-bold text-orange-800 transition hover:bg-orange-50 dark:border-orange-500/40 dark:bg-zinc-900/60 dark:text-orange-200"
                >
                  {t.animeTracker.enterClash} →
                </Link>
              </>
            ) : (
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {t.animeTracker.trendingSyncPending}
              </span>
            )}
          </div>

          {matchTags.length > 0 ? (
            <div className="mt-4 space-y-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900/50">
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                {t.animeTracker.matchTagsHint.replace(
                  "{tags}",
                  matchTags.slice(0, 4).map((tag) => `#${tag}`).join(" "),
                )}
              </p>
              <MatchTagUsageBadges tags={matchTags} />
            </div>
          ) : null}
        </div>
      </div>
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

      <div className="space-y-6">
        {cards.map((card) => (
          <TrendingSpotlightCardView key={card.rank} card={card} />
        ))}
      </div>
    </section>
  );
}
