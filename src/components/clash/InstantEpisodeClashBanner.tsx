"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { HashtagLinks } from "@/components/HashtagLinks";
import type { AnimeReleaseClash } from "@/lib/animeTracker";
import { localizedAnimeTitle } from "@/lib/animeTracker";
import { getIntlLocale } from "@/lib/formatLocale";
import { useLocale } from "@/providers/LocaleProvider";

/** Must match `finalize_expired_anime_release_clashes` in Supabase. */
export const EPISODE_CLASH_WINNER_POINTS = 2000;
export const EPISODE_CLASH_WINDOW_MS = 24 * 60 * 60 * 1000;

export function getEffectiveClosesAt(closesAt: string, opensAt?: string | null): string {
  const closesMs = new Date(closesAt).getTime();
  if (!opensAt) return closesAt;

  const capMs = new Date(opensAt).getTime() + EPISODE_CLASH_WINDOW_MS;
  if (!Number.isFinite(capMs)) return closesAt;

  return new Date(Math.min(closesMs, capMs)).toISOString();
}

export function resolveEpisodeClashEndsAt(
  closesAt: string | null | undefined,
  opensAt: string | null | undefined,
): string | null {
  const candidates: string[] = [];

  if (closesAt) {
    candidates.push(getEffectiveClosesAt(closesAt, opensAt));
  }
  if (opensAt) {
    candidates.push(new Date(new Date(opensAt).getTime() + EPISODE_CLASH_WINDOW_MS).toISOString());
  }

  const now = Date.now();
  for (const candidate of candidates) {
    const ms = new Date(candidate).getTime();
    if (Number.isFinite(ms) && ms > now) {
      return candidate;
    }
  }

  return candidates[0] ?? null;
}

function getRemainingParts(closesAt: string, opensAt?: string | null) {
  const effectiveClosesAt = getEffectiveClosesAt(closesAt, opensAt);
  const ms = Math.max(new Date(effectiveClosesAt).getTime() - Date.now(), 0);
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds, ended: ms <= 0 };
}

type InstantEpisodeClashBannerProps = {
  clashes: AnimeReleaseClash[];
};

function formatUnit(value: number, digits: number, locale: "en" | "ar" | "ja") {
  return new Intl.NumberFormat(getIntlLocale(locale), {
    minimumIntegerDigits: digits,
    useGrouping: false,
  }).format(value);
}

export function EpisodeClashRewardsBadge({ className = "" }: { className?: string }) {
  const { t, formatNumber } = useLocale();

  return (
    <span
      className={`inline-flex rounded-full bg-amber-500/15 px-3 py-1.5 text-xs font-bold text-amber-800 ring-1 ring-amber-400/30 dark:text-amber-200 ${className}`.trim()}
    >
      {t.animeTracker.instantEpisodeRewards.replace("{points}", formatNumber(EPISODE_CLASH_WINNER_POINTS))}
    </span>
  );
}

export function EpisodeClashCountdown({
  closesAt,
  opensAt,
  compact = false,
  prominent = false,
}: {
  closesAt: string;
  opensAt?: string | null;
  compact?: boolean;
  prominent?: boolean;
}) {
  const { t, locale } = useLocale();
  const resolvedClosesAt = useMemo(
    () => resolveEpisodeClashEndsAt(closesAt, opensAt) ?? closesAt,
    [closesAt, opensAt],
  );
  const endsAtMs = useMemo(() => new Date(resolvedClosesAt).getTime(), [resolvedClosesAt]);
  const [remaining, setRemaining] = useState(() => getRemainingParts(resolvedClosesAt, opensAt));

  useEffect(() => {
    setRemaining(getRemainingParts(resolvedClosesAt, opensAt));
    const timer = window.setInterval(() => {
      setRemaining(getRemainingParts(resolvedClosesAt, opensAt));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resolvedClosesAt, opensAt, endsAtMs]);

  const units = [
    { value: remaining.ended ? 0 : remaining.hours, label: t.animeTracker.instantEpisodeHours, digits: 2 },
    { value: remaining.ended ? 0 : remaining.minutes, label: t.animeTracker.instantEpisodeMinutes, digits: 2 },
    { value: remaining.ended ? 0 : remaining.seconds, label: t.animeTracker.instantEpisodeSeconds, digits: 2 },
  ] as const;

  const labelClass = prominent
    ? "mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-orange-700 dark:text-orange-100"
    : compact
      ? "sr-only"
      : "mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400";

  const shellClass = prominent
    ? "grid grid-cols-3 divide-x divide-orange-400/30 overflow-hidden rounded-2xl border-2 border-orange-300/50 bg-gradient-to-b from-orange-600 to-red-700 shadow-lg shadow-orange-900/30"
    : `grid grid-cols-3 divide-x divide-zinc-200 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-700 dark:bg-zinc-900/90 ${
        compact ? "max-w-[200px]" : ""
      }`;

  const digitClass = prominent
    ? "font-sans text-3xl font-bold tabular-nums text-white sm:text-4xl"
    : `font-sans font-bold tabular-nums text-zinc-900 dark:text-white ${compact ? "text-lg" : "text-2xl"}`;

  const unitLabelClass = prominent
    ? "mt-1 text-[10px] font-bold uppercase tracking-wide text-orange-100/90"
    : "mt-0.5 text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400";

  const cellPad = prominent ? "px-4 py-4 sm:px-5 sm:py-5" : compact ? "px-2 py-1.5" : "px-3 py-2.5";

  return (
    <div aria-live="polite" className={prominent ? "w-full max-w-sm" : undefined}>
      <p className={labelClass}>{t.animeTracker.instantEpisodeCountdown}</p>
      <div className={shellClass} dir="ltr">
        {units.map((unit) => (
          <div key={unit.label} className={`flex flex-col items-center ${cellPad}`}>
            <span className={digitClass}>{formatUnit(unit.value, unit.digits, locale)}</span>
            <span className={unitLabelClass}>{unit.label}</span>
          </div>
        ))}
      </div>
      {remaining.ended ? (
        <p className={`mt-2 text-sm font-semibold ${prominent ? "text-orange-100" : "text-zinc-500 dark:text-zinc-400"}`}>
          {t.animeTracker.instantEpisodeEnded}
        </p>
      ) : null}
    </div>
  );
}

export function InstantEpisodeClashBanner({ clashes }: InstantEpisodeClashBannerProps) {
  const { t, locale, formatNumber } = useLocale();
  const clash = clashes[0];
  const closesAt = clash?.closesAt;

  const title = clash
    ? localizedAnimeTitle(
        {
          title: clash.animeTitle,
          titleAr: clash.titleAr,
          titleJa: clash.titleJa,
        },
        locale,
      )
    : "";

  const endsAtMs = useMemo(
    () => (closesAt ? new Date(closesAt).getTime() : 0),
    [closesAt],
  );

  const [remaining, setRemaining] = useState(() =>
    closesAt ? getRemainingParts(closesAt, clash?.opensAt) : { hours: 0, minutes: 0, seconds: 0, ended: true },
  );

  useEffect(() => {
    if (!closesAt) return;

    setRemaining(getRemainingParts(closesAt, clash.opensAt));
    const timer = window.setInterval(() => {
      setRemaining(getRemainingParts(closesAt, clash.opensAt));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [closesAt, endsAtMs]);

  if (!clash || !closesAt || remaining.ended) return null;

  const units = [
    { value: remaining.hours, label: t.animeTracker.instantEpisodeHours, digits: 2 },
    { value: remaining.minutes, label: t.animeTracker.instantEpisodeMinutes, digits: 2 },
    { value: remaining.seconds, label: t.animeTracker.instantEpisodeSeconds, digits: 2 },
  ] as const;

  return (
    <section className="mb-4 sm:mb-6" aria-live="polite">
      <Link
        href={`/tracker/clash/${clash.clashId}`}
        className="group relative block overflow-hidden rounded-2xl border border-orange-500/50 bg-zinc-950 shadow-[0_16px_48px_rgba(249,115,22,0.22)] ring-1 ring-orange-400/30 transition hover:border-orange-400 hover:shadow-orange-500/25"
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-orange-600/25 via-zinc-950 to-red-950/40"
          aria-hidden
        />
        {clash.posterUrl ? (
          <div className="pointer-events-none absolute -end-4 top-1/2 h-36 w-24 -translate-y-1/2 opacity-30 sm:end-6 sm:h-44 sm:w-32 sm:opacity-40">
            <Image
              src={clash.posterUrl}
              alt=""
              width={128}
              height={176}
              className="h-full w-full rounded-lg object-cover shadow-2xl"
              unoptimized
            />
          </div>
        ) : null}

        <div className="relative flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-300">
              {t.animeTracker.instantEpisodeBadge}
            </p>
            <h2 className="mt-2 font-display text-xl font-bold leading-snug text-white sm:text-2xl">
              {t.animeTracker.instantEpisodeTitle.replace("{title}", title).replace(
                "{episode}",
                String(clash.episodeNumber),
              )}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-orange-100/90">
              {t.animeTracker.instantEpisodeSubtitle}
            </p>
            <p className="mt-3 inline-flex rounded-full bg-black/40 px-3 py-1.5 text-xs font-bold text-amber-200 ring-1 ring-amber-400/30">
              {t.animeTracker.instantEpisodeRewards.replace("{points}", formatNumber(EPISODE_CLASH_WINNER_POINTS))}
            </p>
          </div>

          <div className="shrink-0">
            <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400 sm:text-start">
              {t.animeTracker.instantEpisodeCountdown}
            </p>
            <div
              className="grid grid-cols-3 divide-x divide-zinc-800 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900/90"
              dir="ltr"
            >
              {units.map((unit) => (
                <div key={unit.label} className="flex flex-col items-center px-3 py-2.5">
                  <span className="font-sans text-2xl font-bold tabular-nums text-white">
                    {formatUnit(unit.value, unit.digits, locale)}
                  </span>
                  <span className="mt-0.5 text-[10px] font-semibold uppercase text-zinc-400">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
            <span className="mt-3 flex w-full justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-900/40 transition group-hover:brightness-110 sm:justify-center">
              {t.animeTracker.instantEpisodeCta}
            </span>
          </div>
        </div>
      </Link>

      {clash.matchTags.length > 0 ? (
        <HashtagLinks
          tags={clash.matchTags.slice(0, 4)}
          className="mt-2 px-1 text-xs font-medium text-zinc-500 dark:text-zinc-400"
          linkClassName="text-zinc-500 transition-colors hover:text-orange-400 hover:underline dark:text-zinc-400"
        />
      ) : null}
    </section>
  );
}
