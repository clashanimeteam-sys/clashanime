"use client";

import { useEffect, useMemo, useState } from "react";
import { formatSeasonCountdown, getSeasonRemainingMs, type ClashSeason } from "@/lib/clashSeasons";
import { getIntlLocale } from "@/lib/formatLocale";
import { useLocale } from "@/providers/LocaleProvider";

type SeasonCountdownProps = {
  season: ClashSeason;
};

function formatCountdownUnit(value: number, minDigits: number, locale: "en" | "ar" | "ja") {
  return new Intl.NumberFormat(getIntlLocale(locale), {
    minimumIntegerDigits: minDigits,
    useGrouping: false,
  }).format(value);
}

export function SeasonCountdown({ season }: SeasonCountdownProps) {
  const { t, locale } = useLocale();
  const endsAtMs = useMemo(() => new Date(season.ends_at).getTime(), [season.ends_at]);
  const [remainingMs, setRemainingMs] = useState(() => getSeasonRemainingMs(season.ends_at));

  useEffect(() => {
    setRemainingMs(getSeasonRemainingMs(season.ends_at));

    const timer = window.setInterval(() => {
      setRemainingMs(Math.max(endsAtMs - Date.now(), 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [endsAtMs, season.ends_at]);

  const { days, hours, minutes, seconds } = formatSeasonCountdown(remainingMs);
  const ended = remainingMs <= 0;

  const units = [
    { value: days, label: t.home.seasonDays, digits: days >= 100 ? 3 : 2 },
    { value: hours, label: t.home.seasonHours, digits: 2 },
    { value: minutes, label: t.home.seasonMinutes, digits: 2 },
    { value: seconds, label: t.home.seasonSeconds, digits: 2 },
  ] as const;

  return (
    <div className="absolute end-0 top-0 z-20 w-full max-w-[19rem] sm:max-w-[20rem]">
      <div className="overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-950/92 shadow-[0_16px_48px_rgba(0,0,0,0.45)] ring-1 ring-white/5 backdrop-blur-md">
        <div className="border-b border-zinc-800/90 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
            {t.home.seasonCountdownLabel}
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-white">{season.name}</p>
        </div>

        <div className="grid grid-cols-4 divide-x divide-zinc-800/90 px-1 py-3 sm:py-3.5" dir="ltr">
          {units.map((unit) => (
            <div key={unit.label} className="flex flex-col items-center justify-center gap-1.5 px-1">
              <span className="font-sans text-[1.65rem] font-bold leading-none tabular-nums tracking-tight text-white sm:text-[1.85rem]">
                {formatCountdownUnit(unit.value, unit.digits, locale)}
              </span>
              <span className="text-[10px] font-medium leading-none text-zinc-500 sm:text-[11px]">
                {unit.label}
              </span>
            </div>
          ))}
        </div>

        {ended ? (
          <p className="border-t border-zinc-800/90 px-4 py-2 text-center text-xs font-medium text-amber-300/90">
            {t.home.seasonEnded}
          </p>
        ) : (
          <div className="h-0.5 bg-gradient-to-r from-transparent via-accent/70 to-transparent" aria-hidden />
        )}
      </div>
    </div>
  );
}
