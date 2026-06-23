"use client";

import { useEffect, useMemo, useState } from "react";
import { formatSeasonCountdown, getSeasonRemainingMs, type ClashSeason } from "@/lib/clashSeasons";
import { getIntlLocale } from "@/lib/formatLocale";
import { useLocale } from "@/providers/LocaleProvider";

type SeasonCountdownProps = {
  season: ClashSeason;
  className?: string;
};

function formatCountdownUnit(value: number, minDigits: number, locale: "en" | "ar" | "ja") {
  return new Intl.NumberFormat(getIntlLocale(locale), {
    minimumIntegerDigits: minDigits,
    useGrouping: false,
  }).format(value);
}

export function SeasonCountdown({ season, className = "" }: SeasonCountdownProps) {
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
    <div className={`w-full max-w-[20rem] ${className}`}>
      <div className="overflow-hidden rounded-xl border border-zinc-600/80 bg-zinc-950 shadow-lg ring-1 ring-white/10">
        <div className="border-b border-zinc-800 bg-zinc-900/95 px-3.5 py-2.5">
          <p className="text-[11px] font-semibold leading-snug text-zinc-400">
            {t.home.seasonCountdownLabel}
          </p>
          <p className="mt-0.5 truncate text-sm font-bold text-white">{season.name}</p>
        </div>

        <div className="grid grid-cols-4 divide-x divide-zinc-800 bg-zinc-950 px-0.5 py-3" dir="ltr">
          {units.map((unit) => (
            <div key={unit.label} className="flex flex-col items-center justify-center gap-1 px-1">
              <span className="font-sans text-2xl font-bold leading-none tabular-nums text-white sm:text-[1.75rem]">
                {formatCountdownUnit(unit.value, unit.digits, locale)}
              </span>
              <span className="text-[11px] font-medium leading-none text-zinc-400">{unit.label}</span>
            </div>
          ))}
        </div>

        {ended ? (
          <p className="border-t border-zinc-800 px-3 py-2 text-center text-xs font-semibold text-amber-300">
            {t.home.seasonEnded}
          </p>
        ) : null}
      </div>
    </div>
  );
}
