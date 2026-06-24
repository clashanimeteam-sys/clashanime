"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimeRadioArtwork } from "@/components/radio/AnimeRadioArtwork";
import { AnimeRadioVisualizer } from "@/components/radio/AnimeRadioVisualizer";
import { trackArtwork } from "@/lib/animeBeatsLounge";
import { useBeatsLounge } from "@/providers/BeatsLoungeProvider";
import { useLocale } from "@/providers/LocaleProvider";

export function BeatsLoungeMiniBar() {
  const pathname = usePathname();
  const { t } = useLocale();
  const {
    currentTrack,
    isPlaying,
    hasStarted,
    loungePanelOpen,
    togglePlay,
    playNext,
    volume,
    muted,
    setVolume,
    toggleMute,
    stopListening,
  } = useBeatsLounge();

  if (
    !hasStarted ||
    !currentTrack ||
    loungePanelOpen ||
    pathname.startsWith("/video/")
  ) {
    return null;
  }

  const title = currentTrack.title;
  const artist = currentTrack.animeTitle
    ? `${currentTrack.artist} · ${currentTrack.animeTitle}`
    : currentTrack.artist;
  const displayArt = trackArtwork(currentTrack);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-40 flex justify-center px-3 sm:bottom-4 md:start-56 md:end-3 lg:start-60 lg:end-4">
      <div
        data-radio-controls
        className={`pointer-events-auto relative w-full max-w-lg rounded-2xl border-2 border-fuchsia-500/50 bg-zinc-900/95 shadow-[0_12px_48px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:max-w-2xl ${
          isPlaying ? "ring-2 ring-fuchsia-400/40" : ""
        }`}
      >
        <div className="relative flex items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5">
          <AnimeRadioVisualizer active={isPlaying} mini />
          <AnimeRadioArtwork
            src={displayArt}
            alt={title}
            isPlaying={isPlaying}
            accentFrom="#e879f9"
            accentTo="#9333ea"
            size="mini"
          />
          <div className="min-w-0 flex-1">
            <p dir="auto" className="truncate text-xs font-bold text-white sm:text-sm">
              {title}
            </p>
            <p dir="auto" className="truncate text-[10px] text-zinc-300 sm:text-xs">
              {artist}
            </p>
            <p className="mt-0.5 hidden text-[10px] font-medium text-emerald-300 sm:block">
              {t.lounge.audioOnlyBadge}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => void togglePlay()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-fuchsia-500 text-white shadow-md shadow-fuchsia-500/30 transition hover:bg-fuchsia-400"
              aria-label={isPlaying ? t.lounge.pause : t.lounge.play}
            >
              {isPlaying ? "❚❚" : "▶"}
            </button>
            <button
              type="button"
              onClick={playNext}
              className="hidden rounded-full border-2 border-zinc-600 bg-zinc-800 px-2.5 py-1 text-xs font-semibold text-white sm:inline-flex"
            >
              {t.lounge.next}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="hidden rounded-full border-2 border-zinc-600 bg-zinc-800 px-2.5 py-1 text-xs font-semibold text-white md:inline-flex"
            >
              {muted ? t.lounge.unmute : t.lounge.mute}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              className="hidden h-1.5 w-16 accent-fuchsia-400 md:block"
              aria-label={t.lounge.volume}
            />
            <Link
              href="/music?mode=lounge"
              className="rounded-full border-2 border-fuchsia-400/50 bg-fuchsia-500/15 p-2 text-fuchsia-200 transition hover:bg-fuchsia-500/30"
              aria-label={t.lounge.tabLounge}
            >
              ♫
            </Link>
            <button
              type="button"
              onClick={stopListening}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-zinc-600 bg-zinc-800 text-sm font-bold text-zinc-200 transition hover:border-zinc-400 hover:text-white"
              aria-label={t.lounge.closePlayer}
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
