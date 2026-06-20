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
    <div
      data-radio-controls
      onPointerDown={(event) => event.stopPropagation()}
      className="fixed bottom-0 z-40 start-0 end-0 md:start-56 lg:start-60"
    >
      <div
        className="relative overflow-hidden border-t border-white/10 bg-zinc-950/95 shadow-[0_-6px_24px_rgba(0,0,0,0.35)] backdrop-blur-xl"
        style={{
          backgroundImage: `linear-gradient(90deg, ${station.accentFrom}18, transparent 40%, ${station.accentTo}12)`,
        }}
      >
        {isPlaying ? (
          <div
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
            aria-hidden
          />
        ) : null}

        <div className="relative mx-auto flex max-w-7xl items-center gap-2 px-2 py-1.5 sm:gap-3 sm:px-4 sm:py-2">
          <div className="hidden shrink-0 sm:flex">
            <AnimeRadioVisualizer active={isPlaying} mini />
          </div>

          <div className="relative h-8 w-8 shrink-0 sm:h-9 sm:w-9">
            <div
              className={`absolute inset-0 rounded-lg ${isPlaying ? "animate-[radio-glow_2.2s_ease-in-out_infinite]" : "opacity-40"}`}
              style={{
                background: `linear-gradient(135deg, ${station.accentFrom}88, ${station.accentTo}66)`,
              }}
            />
            <div className="absolute inset-0.5 overflow-hidden rounded-md border border-white/20 relative">
              <Image
                src={displayArt}
                alt=""
                fill
                className="object-cover"
                sizes="36px"
                unoptimized
              />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              {isPlaying ? (
                <span className="h-1 w-1 shrink-0 animate-[live-dot_1.2s_ease-in-out_infinite] rounded-full bg-accent" />
              ) : null}
              <p className="truncate text-xs font-semibold text-white sm:text-sm">{title}</p>
            </div>
            <p className="truncate text-[10px] text-zinc-400 sm:text-xs">{artist}</p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => void togglePlay()}
              disabled={isLoading}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white shadow-md shadow-accent/25 transition-transform hover:scale-105 active:scale-95 disabled:opacity-60 sm:h-9 sm:w-9"
              aria-label={isPlaying ? t.radio.pause : t.radio.play}
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
                  <rect x="6" y="5" width="4" height="14" />
                  <rect x="14" y="5" width="4" height="14" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="hidden rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm transition-colors hover:border-accent hover:text-accent sm:inline-flex"
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
              onInput={(event) => setVolume(Number(event.currentTarget.value))}
              className="relative z-10 h-2 w-14 cursor-pointer accent-accent sm:w-20 md:w-24"
              aria-label={t.radio.volume}
            />

            <Link
              href="/music"
              className="hidden shrink-0 rounded-full border border-accent/30 bg-accent/10 p-1.5 text-accent transition-colors hover:bg-accent/20 md:inline-flex"
              aria-label={t.radio.openFullPlayer}
              title={t.radio.openFullPlayer}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden>
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
