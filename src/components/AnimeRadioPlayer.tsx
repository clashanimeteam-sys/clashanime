"use client";

import Image from "next/image";
import { getRadioStation, RADIO_STATIONS, type RadioStationId } from "@/lib/animeRadio";
import { AnimeRadioArtwork } from "@/components/radio/AnimeRadioArtwork";
import { AnimeRadioScene } from "@/components/radio/AnimeRadioScene";
import { AnimeRadioVisualizer } from "@/components/radio/AnimeRadioVisualizer";
import { useAnimeRadio } from "@/providers/AnimeRadioProvider";
import { useLocale } from "@/providers/LocaleProvider";

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

  const station = getRadioStation(stationId);
  const activeStationLabel = stationLabel(stationId, t.radio);
  const title = nowPlaying?.title ?? activeStationLabel;
  const artist = nowPlaying?.artist ?? t.radio.liveBroadcast;
  const displayArt = nowPlaying?.artworkUrl ?? station.coverImage;
  const trackKey = `${stationId}-${title}-${artist}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <section className="relative mb-8 overflow-hidden rounded-3xl border border-zinc-200 p-6 dark:border-zinc-800 sm:p-8">
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center opacity-30 blur-2xl dark:opacity-20"
          style={{ backgroundImage: `url(${displayArt})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/75 to-orange-50/70 dark:from-black/90 dark:via-black/75 dark:to-orange-950/30" />

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            {t.radio.badge}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-black dark:text-white sm:text-4xl">
            {t.radio.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-600 sm:text-base dark:text-zinc-400">
            {t.radio.subtitle}
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-zinc-200 shadow-xl dark:border-zinc-800">
        <AnimeRadioScene
          active={isPlaying}
          accentFrom={station.accentFrom}
          accentTo={station.accentTo}
        />

        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${displayArt})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-zinc-950/85 to-black/90" />

        <div className="relative p-5 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-accent">
              <span
                className={`h-2 w-2 rounded-full bg-accent ${isPlaying ? "animate-[live-dot_1.2s_ease-in-out_infinite]" : "opacity-50"}`}
              />
              {isPlaying ? t.radio.liveOnAir : t.radio.liveBroadcast}
            </span>
            <AnimeRadioVisualizer active={isPlaying} />
          </div>

          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center">
            <AnimeRadioArtwork
              src={displayArt}
              alt={title}
              isPlaying={isPlaying}
              accentFrom={station.accentFrom}
              accentTo={station.accentTo}
            />

            <div className="min-w-0 flex-1 text-center lg:text-start">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
                {t.radio.nowPlaying}
              </p>
              <div key={trackKey} className="animate-[track-enter_0.45s_ease-out]">
                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{title}</h2>
                <p className="mt-2 text-sm text-zinc-300 sm:text-base">{artist}</p>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <button
                  type="button"
                  onClick={() => void togglePlay()}
                  disabled={isLoading}
                  className="inline-flex h-12 min-w-36 items-center justify-center rounded-full bg-accent px-7 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition-transform hover:scale-105 active:scale-95 disabled:opacity-60"
                >
                  {isLoading ? t.radio.loading : isPlaying ? t.radio.pause : t.radio.play}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-accent hover:text-accent"
                >
                  {muted ? t.radio.unmute : t.radio.mute}
                </button>
              </div>

              <label className="mt-5 block">
                <span className="mb-2 block text-xs font-medium text-zinc-400">{t.radio.volume}</span>
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
                <p className="mt-4 text-sm text-red-400" role="alert">
                  {t.radio.streamError}
                </p>
              ) : null}

              <p className="mt-4 text-xs text-zinc-500">{t.radio.keepListening}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
          {t.radio.pickStation}
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {RADIO_STATIONS.map((entry) => {
            const active = entry.id === stationId;
            const label = stationLabel(entry.id, t.radio);
            const description =
              entry.id === "lofi-anime" ? t.radio.stationLofiDesc : t.radio.stationOstDesc;

            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => selectStation(entry.id)}
                className={`group relative overflow-hidden rounded-2xl border text-start transition-all duration-300 ${
                  active
                    ? "border-accent/60 shadow-lg shadow-accent/20"
                    : "border-zinc-200 hover:-translate-y-1 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                }`}
              >
                <div className="relative h-36 overflow-hidden">
                  <Image
                    src={entry.coverImage}
                    alt=""
                    fill
                    className={`object-cover transition-transform duration-500 ${active ? "scale-110" : "group-hover:scale-105"}`}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    unoptimized
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, rgba(0,0,0,0.88), rgba(0,0,0,0.15))`,
                    }}
                  />
                  {active ? (
                    <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                      {t.radio.activeStation}
                    </span>
                  ) : null}
                </div>
                <div className="relative bg-zinc-950/95 p-4">
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="mt-1 text-xs text-zinc-400">{description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <p className="mt-6 text-center text-[11px] text-zinc-500">{t.radio.poweredBy}</p>
    </div>
  );
}
