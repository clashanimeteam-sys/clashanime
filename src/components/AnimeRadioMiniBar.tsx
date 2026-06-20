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
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-40 flex justify-center px-3 sm:bottom-4 md:start-56 md:end-3 lg:start-60 lg:end-4">
      <div
        data-radio-controls
        onPointerDown={(event) => event.stopPropagation()}
        className={`pointer-events-auto relative w-full max-w-lg overflow-hidden rounded-full border border-white/15 bg-zinc-950/92 shadow-[0_10px_40px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.04)_inset] backdrop-blur-xl sm:max-w-2xl ${
          isPlaying ? "shadow-accent/15 ring-1 ring-accent/25" : ""
        }`}
        style={{
          backgroundImage: `linear-gradient(90deg, ${station.accentFrom}20, rgba(9,9,11,0.95) 35%, ${station.accentTo}14)`,
        }}
      >
        {isPlaying ? (
          <div
            className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent/80 to-transparent"
            aria-hidden
          />
        ) : null}

        <div className="relative flex items-center gap-2 px-2.5 py-2 sm:gap-3 sm:px-4 sm:py-2.5">
          <div className="hidden shrink-0 ps-0.5 sm:flex">
            <AnimeRadioVisualizer active={isPlaying} mini />
          </div>

          <div className="relative h-9 w-9 shrink-0 sm:h-10 sm:w-10">
            <div
              className={`absolute inset-0 rounded-full ${isPlaying ? "animate-[radio-glow_2.2s_ease-in-out_infinite]" : "opacity-40"}`}
              style={{
                background: `linear-gradient(135deg, ${station.accentFrom}88, ${station.accentTo}66)`,
              }}
            />
            <div className="absolute inset-0.5 overflow-hidden rounded-full border border-white/25 relative">
              <Image
                src={displayArt}
                alt=""
                fill
                className="object-cover"
                sizes="40px"
                unoptimized
              />
            </div>
          </div>

          <div className="min-w-0 flex-1 pe-1">
            <div className="flex items-center gap-1.5">
              {isPlaying ? (
                <span className="h-1.5 w-1.5 shrink-0 animate-[live-dot_1.2s_ease-in-out_infinite] rounded-full bg-accent shadow-[0_0_6px_rgba(249,115,22,0.8)]" />
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
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/30 transition-transform hover:scale-105 active:scale-95 disabled:opacity-60"
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
              className="hidden rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm transition-colors hover:border-accent hover:text-accent md:inline-flex"
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
              className="relative z-10 h-1.5 w-12 cursor-pointer accent-accent sm:w-16 md:w-20"
              aria-label={t.radio.volume}
            />

            <Link
              href="/music"
              className="hidden shrink-0 rounded-full border border-accent/30 bg-accent/10 p-2 text-accent transition-colors hover:bg-accent/20 lg:inline-flex"
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
