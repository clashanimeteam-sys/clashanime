"use client";

import Image from "next/image";
import Link from "next/link";
import {
  EpisodeClashCountdown,
  EpisodeClashRewardsBadge,
  InstantEpisodeClashBanner,
} from "@/components/clash/InstantEpisodeClashBanner";
import { localizedAnimeTitle } from "@/lib/animeTracker";
import type { AnimeReleaseClash, TrendingSpotlightCard } from "@/lib/animeTracker";
import type { JikanAnimeEntry } from "@/lib/jikan";
import { AnimeSynopsisBlock } from "@/components/tracker/AnimeSynopsisBlock";
import { MatchTagUsageBadges } from "@/components/tracker/MatchTagUsageBadges";
import { TrendingSpotlightSection } from "@/components/tracker/TrendingSpotlightSection";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";

export type JikanTrackerEntry = JikanAnimeEntry & {
  clashId?: string | null;
};

type AnimeTrackerPageContentProps = {
  todayReleases: JikanTrackerEntry[];
  upcomingReleases: JikanAnimeEntry[];
  activeClashes: AnimeReleaseClash[];
  trendingSpotlight: TrendingSpotlightCard[];
};

function SectionHeading({
  label,
  accent,
}: {
  label: string;
  accent: "orange" | "violet" | "neutral";
}) {
  const borderColor = {
    orange: "border-orange-500",
    violet: "border-violet-500",
    neutral: "border-zinc-400 dark:border-zinc-600",
  }[accent];

  const textColor = {
    orange: "text-orange-800 dark:text-orange-200",
    violet: "text-violet-800 dark:text-violet-200",
    neutral: "text-zinc-800 dark:text-zinc-200",
  }[accent];

  return (
    <div className={`mb-5 border-s-4 ${borderColor} ps-4`}>
      <h2 className={`font-display text-lg font-bold tracking-wide sm:text-xl ${textColor}`}>
        {label}
      </h2>
    </div>
  );
}

function ReleasePoster({
  url,
  title,
  size = "md",
}: {
  url: string | null;
  title: string;
  size?: "md" | "lg";
}) {
  const dimensions =
    size === "lg"
      ? "h-[130px] w-[92px] rounded-2xl"
      : "h-[108px] w-[76px] rounded-xl";

  if (url) {
    return (
      <Image
        src={url}
        alt={title}
        width={size === "lg" ? 92 : 76}
        height={size === "lg" ? 130 : 108}
        className={`${dimensions} shrink-0 object-cover shadow-md ring-1 ring-black/10 dark:ring-white/10`}
        unoptimized
      />
    );
  }

  return (
    <div
      className={`flex ${dimensions} shrink-0 items-center justify-center bg-gradient-to-br from-violet-600 to-fuchsia-700 text-3xl shadow-md`}
      aria-hidden
    >
      📡
    </div>
  );
}

function localizedJikanTitle(
  entry: Pick<JikanAnimeEntry, "title" | "titleEnglish" | "titleJapanese">,
  locale: "en" | "ja" | "ar",
): string {
  if (locale === "ja" && entry.titleJapanese) return entry.titleJapanese;
  if (entry.titleEnglish) return entry.titleEnglish;
  return entry.title;
}

function MetaBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
      {children}
    </span>
  );
}

function ActiveClashCard({ clash }: { clash: AnimeReleaseClash }) {
  const { t, locale, formatNumber } = useLocale();
  const title = localizedAnimeTitle(
    {
      title: clash.animeTitle,
      titleAr: clash.titleAr,
      titleJa: clash.titleJa,
    },
    locale,
  );

  return (
    <Link
      href={`/tracker/clash/${clash.clashId}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-50 shadow-lg shadow-orange-500/10 transition hover:-translate-y-0.5 hover:border-orange-400 hover:shadow-xl dark:border-orange-500/40 dark:from-orange-950/50 dark:via-zinc-950 dark:to-red-950/40 dark:shadow-orange-900/20 sm:flex-row"
    >
      <div className="relative shrink-0 p-4 sm:p-5">
        <ReleasePoster url={clash.posterUrl} title={title} size="lg" />
        <span className="absolute start-6 top-6 rounded-lg bg-orange-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
          {t.animeTracker.liveClashBadge}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 border-t border-orange-100 p-4 dark:border-orange-500/20 sm:border-s-0 sm:border-t-0 sm:py-5 sm:pe-5">
        <div>
          <h3 className="font-display text-xl font-bold leading-snug text-zinc-900 group-hover:text-orange-700 dark:text-white dark:group-hover:text-orange-200 sm:text-2xl">
            {title}
          </h3>
          <p className="mt-2 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
            {t.animeTracker.episodeLabel.replace("{episode}", String(clash.episodeNumber))}
          </p>
          <p className="mt-3 text-base font-medium text-orange-700 dark:text-orange-300">
            {t.animeTracker.clipCount.replace("{count}", formatNumber(clash.clipCount))}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <EpisodeClashRewardsBadge />
            {clash.closesAt ? <EpisodeClashCountdown closesAt={clash.closesAt} compact /> : null}
          </div>
          <AnimeSynopsisBlock synopsis={clash} variant="compact" />
          {clash.matchTags.length > 0 ? (
            <MatchTagUsageBadges tags={clash.matchTags} title={title} className="mt-3" />
          ) : null}
        </div>

        <span className="inline-flex w-fit rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-500/30 transition group-hover:brightness-110">
          {t.animeTracker.enterClash} →
        </span>
      </div>
    </Link>
  );
}

function ReleaseCard({
  release,
  showClashLink,
}: {
  release: JikanTrackerEntry | JikanAnimeEntry;
  showClashLink?: boolean;
}) {
  const { t, locale, formatDateTime, formatNumber } = useLocale();
  const title = localizedJikanTitle(release, locale);
  const clashId = "clashId" in release ? release.clashId : null;
  const hasClash = Boolean(clashId);

  return (
    <article className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-violet-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/90 dark:hover:border-violet-500/40 sm:p-5">
      <ReleasePoster url={release.posterUrl} title={title} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-violet-100 px-2.5 py-1 text-xs font-bold text-violet-800 dark:bg-violet-500/20 dark:text-violet-200">
            {t.animeTracker.episodeLabel.replace("{episode}", String(release.episodeNumber))}
          </span>
          <span className="rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800 dark:bg-blue-500/20 dark:text-blue-200">
            {t.animeTracker.jikanSource}
          </span>
        </div>

        <h3 className="mt-3 text-lg font-bold leading-snug text-zinc-900 dark:text-white sm:text-xl">
          {title}
        </h3>

        <AnimeSynopsisBlock synopsis={release} variant="compact" />

        <p className="mt-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          {release.broadcastLabel ??
            (release.airsAt
              ? formatDateTime(release.airsAt, { dateStyle: "medium", timeStyle: "short" })
              : formatDateTime(release.releaseDate, { dateStyle: "medium" }))}
        </p>

        {(release.score || release.rank || release.genres.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {release.score ? (
              <MetaBadge>
                {t.animeTracker.scoreLabel.replace("{score}", formatNumber(release.score))}
              </MetaBadge>
            ) : null}
            {release.rank ? (
              <MetaBadge>
                {t.animeTracker.rankLabel.replace("{rank}", formatNumber(release.rank))}
              </MetaBadge>
            ) : null}
            {release.genres.slice(0, 3).map((genre) => (
              <MetaBadge key={genre}>{genre}</MetaBadge>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {hasClash && showClashLink ? (
            <Link
              href={`/tracker/clash/${clashId}`}
              className="inline-flex rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-md shadow-orange-500/25 transition hover:brightness-110"
            >
              {t.animeTracker.enterClash}
            </Link>
          ) : showClashLink ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.animeTracker.scheduledHint}</p>
          ) : null}
          {release.malUrl ? (
            <a
              href={release.malUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-violet-700 underline-offset-2 hover:underline dark:text-violet-300"
            >
              {t.animeTracker.malLink}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-8 text-center text-base font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300">
      {message}
    </p>
  );
}

export function AnimeTrackerPageContent({
  todayReleases,
  upcomingReleases,
  activeClashes,
  trendingSpotlight,
}: AnimeTrackerPageContentProps) {
  const { t, formatNumber } = useLocale();
  usePageTitle(t.pages.animeTrackerTitle);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="relative mb-10 overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-violet-50 via-white to-orange-50 px-6 py-8 shadow-sm dark:border-zinc-800 dark:from-violet-950/50 dark:via-zinc-950 dark:to-orange-950/30 sm:px-8">
        <div className="pointer-events-none absolute -end-16 -top-16 h-48 w-48 rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-500/10" />
        <div className="pointer-events-none absolute -bottom-16 -start-16 h-48 w-48 rounded-full bg-orange-400/20 blur-3xl dark:bg-orange-500/10" />

        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-violet-700 dark:text-violet-300">
            {t.animeTracker.badge}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
            {t.pages.animeTrackerTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-700 dark:text-zinc-200 sm:text-lg">
            {t.pages.animeTrackerSubtitle}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-xl border border-orange-200 bg-white/80 px-4 py-2 text-sm font-bold text-orange-800 shadow-sm dark:border-orange-500/30 dark:bg-zinc-900/60 dark:text-orange-200">
              {t.animeTracker.activeClashesTitle}: {formatNumber(activeClashes.length)}
            </span>
            <span className="rounded-xl border border-violet-200 bg-white/80 px-4 py-2 text-sm font-bold text-violet-800 shadow-sm dark:border-violet-500/30 dark:bg-zinc-900/60 dark:text-violet-200">
              {t.animeTracker.todayTitle}: {formatNumber(todayReleases.length)}
            </span>
            <span className="rounded-xl border border-zinc-200 bg-white/80 px-4 py-2 text-sm font-bold text-zinc-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-200">
              {t.animeTracker.upcomingTitle}: {formatNumber(upcomingReleases.length)}
            </span>
          </div>
        </div>
      </header>

      <TrendingSpotlightSection cards={trendingSpotlight} />

      <InstantEpisodeClashBanner clashes={activeClashes} />

      {activeClashes.length > 0 ? (
        <section className="mb-12">
          <SectionHeading label={t.animeTracker.activeClashesTitle} accent="orange" />
          <div className="grid gap-5 lg:grid-cols-2">
            {activeClashes.map((clash) => (
              <ActiveClashCard key={clash.clashId} clash={clash} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mb-12">
        <SectionHeading label={t.animeTracker.todayTitle} accent="violet" />
        {todayReleases.length > 0 ? (
          <div className="grid gap-4">
            {todayReleases.map((release) => (
              <ReleaseCard
                key={`${release.malId || release.title}-${release.releaseDate}`}
                release={release}
                showClashLink
              />
            ))}
          </div>
        ) : (
          <EmptyState message={t.animeTracker.noToday} />
        )}
      </section>

      <section>
        <SectionHeading label={t.animeTracker.upcomingTitle} accent="neutral" />
        {upcomingReleases.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {upcomingReleases.map((release) => (
              <ReleaseCard
                key={`${release.malId || release.title}-${release.releaseDate}`}
                release={release}
              />
            ))}
          </div>
        ) : (
          <EmptyState message={t.animeTracker.noUpcoming} />
        )}
      </section>
    </div>
  );
}
