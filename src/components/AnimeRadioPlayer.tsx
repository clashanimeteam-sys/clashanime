"use client";

import Image from "next/image";
import { RADIO_STATIONS, type RadioStationId } from "@/lib/animeRadio";
import { useAnimeRadio } from "@/providers/AnimeRadioProvider";
import { useLocale } from "@/providers/LocaleProvider";

function EqualizerBars({ active }: { active: boolean }) {
  return (
    <div className="flex h-8 items-end gap-1" aria-hidden>
      {[0, 1, 2, 3].map((bar) => (
        <span
          key={bar}
          className={`w-1 rounded-full bg-accent ${active ? "origin-bottom animate-[radio-bar_0.9s_ease-in-out_infinite]" : "h-2 opacity-40"}`}
          style={
            active
              ? {
                  height: `${38 + bar * 10}%`,
                  animationDelay: `${bar * 120}ms`,
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}

function stationLabel(
  stationId: RadioStationId,
  labels: { stationOst: string; stationLofi: string },
) {
  return stationId === "lofi-anime" ? labels.stationLofi : labels.stationOst;
}

export function AnimeRadioPlayer() {
  const { t } = useLocale();
  const {
    stationId,
    isPlaying,
    isLoading,
    nowPlaying,
    error,
    volume,
    muted,
    selectStation,
    togglePlay,
    setVolume,
    toggleMute,
  } = useAnimeRadio();

  const activeStationLabel = stationLabel(stationId, t.radio);
  const title = nowPlaying?.title ?? activeStationLabel;
  const artist = nowPlaying?.artist ?? t.radio.liveBroadcast;
  const artwork = nowPlaying?.artworkUrl;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <section className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
          {t.radio.badge}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-black dark:text-white">{t.radio.title}</h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-600 sm:text-base dark:text-zinc-400">
          {t.radio.subtitle}
        </p>
      </section>

      <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-orange-50/50 p-5 shadow-sm dark:border-zinc-800 dark:from-zinc-950 dark:via-black dark:to-orange-950/20 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="mx-auto flex h-44 w-44 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 sm:h-52 sm:w-52">
            {artwork ? (
              <Image
                src={artwork}
                alt=""
                width={208}
                height={208}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <EqualizerBars active={isPlaying} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
              {t.radio.nowPlaying}
            </p>
            <h2 className="mt-2 truncate text-2xl font-bold text-black dark:text-white">{title}</h2>
            <p className="mt-1 truncate text-sm text-zinc-600 dark:text-zinc-400">{artist}</p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void togglePlay()}
                disabled={isLoading}
                className="inline-flex h-12 min-w-32 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {isLoading ? t.radio.loading : isPlaying ? t.radio.pause : t.radio.play}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-black transition-colors hover:border-accent hover:text-accent dark:border-zinc-700 dark:text-white"
              >
                {muted ? t.radio.unmute : t.radio.mute}
              </button>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-xs font-medium text-zinc-500">{t.radio.volume}</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={muted ? 0 : volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                className="w-full accent-accent"
              />
            </label>

            {error ? (
              <p className="mt-4 text-sm text-red-500" role="alert">
                {t.radio.streamError}
              </p>
            ) : null}

            <p className="mt-4 text-xs text-zinc-500">{t.radio.keepListening}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {RADIO_STATIONS.map((station) => {
            const active = station.id === stationId;
            const label = stationLabel(station.id, t.radio);
            const description =
              station.id === "lofi-anime" ? t.radio.stationLofiDesc : t.radio.stationOstDesc;

            return (
              <button
                key={station.id}
                type="button"
                onClick={() => selectStation(station.id)}
                className={`rounded-2xl border p-4 text-start transition-colors ${
                  active
                    ? "border-accent/50 bg-accent/10"
                    : "border-zinc-200 bg-white/80 hover:border-zinc-300 dark:border-zinc-800 dark:bg-black/70 dark:hover:border-zinc-700"
                }`}
              >
                <p className="text-sm font-semibold text-black dark:text-white">{label}</p>
                <p className="mt-1 text-xs text-zinc-500">{description}</p>
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-[11px] text-zinc-500">{t.radio.poweredBy}</p>
      </section>
    </div>
  );
}
