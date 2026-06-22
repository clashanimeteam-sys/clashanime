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
  const { currentTrack, isPlaying, hasStarted, togglePlay, playNext, volume, muted, setVolume, toggleMute } =
    useBeatsLounge();

  if (!hasStarted || !currentTrack || pathname === "/music" || pathname.startsWith("/video/")) {
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
        className={`pointer-events-auto relative w-full max-w-lg rounded-full border border-fuchsia-400/25 bg-zinc-950/92 shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:max-w-2xl ${
          isPlaying ? "ring-1 ring-fuchsia-400/30" : ""
        }`}
      >
        <div className="relative flex items-center gap-2 px-2.5 py-1.5 sm:gap-3 sm:px-4 sm:py-2">
          <AnimeRadioVisualizer active={isPlaying} mini />
          <AnimeRadioArtwork
            src={displayArt}
            alt={title}
            isPlaying={isPlaying}
            accentFrom="#d946ef"
            accentTo="#7c3aed"
            size="mini"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white sm:text-sm">{title}</p>
            <p className="truncate text-[10px] text-zinc-400 sm:text-xs">{artist}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => void togglePlay()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-fuchsia-500 text-white"
              aria-label={isPlaying ? t.lounge.pause : t.lounge.play}
            >
              {isPlaying ? "❚❚" : "▶"}
            </button>
            <button type="button" onClick={playNext} className="hidden rounded-full border border-white/15 px-2 py-1 text-xs text-white sm:inline-flex">
              {t.lounge.next}
            </button>
            <button type="button" onClick={toggleMute} className="hidden rounded-full border border-white/15 px-2 py-1 text-xs text-white md:inline-flex">
              {muted ? t.lounge.unmute : t.lounge.mute}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              className="hidden h-1.5 w-16 accent-fuchsia-500 md:block"
              aria-label={t.lounge.volume}
            />
            <Link href="/music?mode=lounge" className="rounded-full border border-fuchsia-400/30 p-2 text-fuchsia-300">
              ♫
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
