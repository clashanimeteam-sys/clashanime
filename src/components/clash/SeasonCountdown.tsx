"use client";

import { useEffect, useMemo, useState } from "react";
import { formatSeasonCountdown, getSeasonRemainingMs, type ClashSeason } from "@/lib/clashSeasons";
import { useLocale } from "@/providers/LocaleProvider";

type SeasonCountdownProps = {
  season: ClashSeason;
};

export function SeasonCountdown({ season }: SeasonCountdownProps) {
  const { t } = useLocale();
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

  return (
    <div className="absolute end-0 top-0 z-20 w-full max-w-[17rem] sm:max-w-xs">
      <div className="overflow-hidden rounded-2xl border border-amber-400/35 bg-black/55 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <div className="border-b border-amber-400/20 bg-gradient-to-r from-amber-500/15 to-orange-500/10 px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300">
            {t.home.seasonCountdownLabel}
          </p>
          <p className="truncate text-xs font-semibold text-amber-50">{season.name}</p>
        </div>

        <div className="grid grid-cols-4 gap-1 px-2 py-2.5" dir="ltr">
          {[
            { value: days, label: t.home.seasonDays },
            { value: hours, label: t.home.seasonHours },
            { value: minutes, label: t.home.seasonMinutes },
            { value: seconds, label: t.home.seasonSeconds },
          ].map((unit) => (
            <div
              key={unit.label}
              className="rounded-xl border border-amber-400/15 bg-zinc-950/70 px-1 py-1.5 text-center"
            >
              <p className="font-display text-lg font-black leading-none text-amber-200 sm:text-xl">
                {String(unit.value).padStart(2, "0")}
              </p>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-wide text-amber-400/80">
                {unit.label}
              </p>
            </div>
          ))}
        </div>

        {ended ? (
          <p className="px-3 pb-2 text-center text-[11px] font-semibold text-orange-300">
            {t.home.seasonEnded}
          </p>
        ) : null}
      </div>
    </div>
  );
}
