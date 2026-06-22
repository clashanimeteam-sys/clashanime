"use client";

import Image from "next/image";
import Link from "next/link";
import type {
  AnimeRelease,
  AnimeReleaseClash,
  AnimeReleaseUpcoming,
} from "@/lib/animeTracker";
import { localizedAnimeTitle } from "@/lib/animeTracker";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";

type AnimeTrackerPageContentProps = {
  todayReleases: AnimeRelease[];
  upcomingReleases: AnimeReleaseUpcoming[];
  activeClashes: AnimeReleaseClash[];
};

function ReleasePoster({ url, title }: { url: string | null; title: string }) {
  if (url) {
    return (
      <Image
        src={url}
        alt={title}
        width={72}
        height={102}
        className="h-[102px] w-[72px] shrink-0 rounded-xl object-cover shadow-lg"
        unoptimized
      />
    );
  }

  return (
    <div className="flex h-[102px] w-[72px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-900 to-fuchsia-800 text-2xl shadow-lg">
      📡
    </div>
  );
}

function ReleaseCard({
  release,
  showClashLink,
}: {
  release: AnimeRelease | AnimeReleaseUpcoming;
  showClashLink?: boolean;
}) {
  const { t, locale, formatDateTime } = useLocale();
  const title = localizedAnimeTitle(release, locale);
  const clashId = "clashId" in release ? release.clashId : null;
  const hasClash = Boolean(clashId);

  return (
    <article className="flex gap-4 rounded-2xl border border-violet-500/20 bg-violet-950/20 p-4 backdrop-blur-sm">
      <ReleasePoster url={release.posterUrl} title={title} />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-300">
          {t.animeTracker.episodeLabel.replace("{episode}", String(release.episodeNumber))}
        </p>
        <h3 className="mt-1 text-lg font-bold text-white">{title}</h3>
        <p className="mt-1 text-sm text-zinc-300">
          {release.airsAt
            ? formatDateTime(release.airsAt, { dateStyle: "medium", timeStyle: "short" })
            : formatDateTime(release.releaseDate, { dateStyle: "medium" })}
        </p>
        {hasClash && showClashLink ? (
          <Link
            href={`/tracker/clash/${clashId}`}
            className="mt-3 inline-flex rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-md shadow-orange-500/30"
          >
            {t.animeTracker.enterClash}
          </Link>
        ) : release.status === "scheduled" ? (
          <p className="mt-3 text-xs text-zinc-400">{t.animeTracker.scheduledHint}</p>
        ) : null}
      </div>
    </article>
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
      className="group block overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-950/40 to-red-950/30 p-5 transition hover:border-orange-400/50"
    >
      <div className="flex items-start gap-4">
        <ReleasePoster url={clash.posterUrl} title={title} />
        <div className="min-w-0 flex-1">
          <span className="inline-flex rounded-full bg-orange-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-orange-200">
            {t.animeTracker.liveClashBadge}
          </span>
          <h3 className="mt-2 text-xl font-bold text-white group-hover:text-orange-100">{title}</h3>
          <p className="mt-1 text-sm text-zinc-300">
            {t.animeTracker.episodeLabel.replace("{episode}", String(clash.episodeNumber))}
          </p>
          <p className="mt-2 text-sm text-orange-200">
            {t.animeTracker.clipCount.replace("{count}", formatNumber(clash.clipCount))}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function AnimeTrackerPageContent({
  todayReleases,
  upcomingReleases,
  activeClashes,
}: AnimeTrackerPageContentProps) {
  const { t } = useLocale();
  usePageTitle(t.pages.animeTrackerTitle);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <header className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-300">
          {t.animeTracker.badge}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
          {t.pages.animeTrackerTitle}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-300 sm:text-base">{t.pages.animeTrackerSubtitle}</p>
      </header>

      {activeClashes.length > 0 ? (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-orange-200">
            {t.animeTracker.activeClashesTitle}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {activeClashes.map((clash) => (
              <ActiveClashCard key={clash.clashId} clash={clash} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mb-10">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-violet-200">
          {t.animeTracker.todayTitle}
        </h2>
        {todayReleases.length > 0 ? (
          <div className="grid gap-4">
            {todayReleases.map((release) => (
              <ReleaseCard key={release.id} release={release} showClashLink />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 text-sm text-zinc-400">
            {t.animeTracker.noToday}
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-zinc-300">
          {t.animeTracker.upcomingTitle}
        </h2>
        {upcomingReleases.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {upcomingReleases.map((release) => (
              <ReleaseCard key={release.id} release={release} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 text-sm text-zinc-400">
            {t.animeTracker.noUpcoming}
          </p>
        )}
      </section>
    </div>
  );
}
