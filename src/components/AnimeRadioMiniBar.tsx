"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getRadioStation } from "@/lib/animeRadio";
import { AnimeRadioVisualizer } from "@/components/radio/AnimeRadioVisualizer";
import { useAnimeRadio } from "@/providers/AnimeRadioProvider";
import { useLocale } from "@/providers/LocaleProvider";

function stationLabel(
  stationId: "anime-ost" | "lofi-anime",
  labels: { stationOst: string; stationLofi: string },
) {
  return stationId === "lofi-anime" ? labels.stationLofi : labels.stationOst;
}

export function AnimeRadioMiniBar() {
  const pathname = usePathname();
  const { t } = useLocale();
  const {
    stationId,
    isPlaying,
    isLoading,
    hasStarted,
    nowPlaying,
    volume,
    muted,
    togglePlay,
    setVolume,
    toggleMute,
  } = useAnimeRadio();

  if (!hasStarted || pathname === "/music" || pathname.startsWith("/video/")) {
    return null;
  }

  const station = getRadioStation(stationId);
  const title = nowPlaying?.title ?? stationLabel(stationId, t.radio);
  const artist = nowPlaying?.artist ?? t.radio.liveBroadcast;
  const displayArt = nowPlaying?.artworkUrl ?? station.coverImage;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 md:ps-56 lg:ps-60">
      <div
        className="relative overflow-hidden border-t border-white/10 bg-zinc-950/95 shadow-[0_-12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl"
        style={{
          backgroundImage: `linear-gradient(90deg, ${station.accentFrom}22, transparent 35%, ${station.accentTo}18)`,
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url(${displayArt})` }}
        />

        {isPlaying ? (
          <div
            className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent"
            aria-hidden
          />
        ) : null}

        <div className="relative mx-auto flex max-w-7xl items-center gap-3 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3">
          <div className="hidden min-w-[7rem] shrink-0 sm:flex sm:min-w-[9rem]">
            <AnimeRadioVisualizer active={isPlaying} compact />
          </div>

          <div className="relative h-11 w-11 shrink-0 sm:h-12 sm:w-12">
            <div
              className={`absolute inset-0 rounded-xl ${isPlaying ? "animate-[radio-glow_2.2s_ease-in-out_infinite]" : "opacity-40"}`}
              style={{
                background: `linear-gradient(135deg, ${station.accentFrom}88, ${station.accentTo}66)`,
              }}
            />
            <div className="absolute inset-1 overflow-hidden rounded-lg border border-white/20 relative">
              <Image
                src={displayArt}
                alt=""
                fill
                className="object-cover"
                sizes="48px"
                unoptimized
              />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {isPlaying ? (
                <span className="h-1.5 w-1.5 shrink-0 animate-[live-dot_1.2s_ease-in-out_infinite] rounded-full bg-accent shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              ) : null}
              <p className="truncate text-sm font-semibold text-white">{title}</p>
            </div>
            <p className="truncate text-xs text-zinc-400">{artist}</p>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => void togglePlay()}
              disabled={isLoading}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/30 transition-transform hover:scale-105 active:scale-95 disabled:opacity-60"
              aria-label={isPlaying ? t.radio.pause : t.radio.play}
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
                  <rect x="6" y="5" width="4" height="14" />
                  <rect x="14" y="5" width="4" height="14" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="hidden rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:border-accent hover:text-accent sm:inline-flex"
            >
              {muted ? t.radio.unmute : t.radio.mute}
            </button>

            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              className="hidden w-20 accent-accent sm:block lg:w-24"
              aria-label={t.radio.volume}
            />

            <Link
              href="/music"
              className="hidden shrink-0 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-accent/20 lg:inline-flex"
            >
              {t.radio.openFullPlayer}
            </Link>
          </div>
        </div>

        <div className="flex justify-center pb-1 sm:hidden">
          <AnimeRadioVisualizer active={isPlaying} compact />
        </div>
      </div>
    </div>
  );
}
