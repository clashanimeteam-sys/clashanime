"use client";

import { useEffect } from "react";
import { AnimeRadioArtwork } from "@/components/radio/AnimeRadioArtwork";
import { AnimeRadioScene } from "@/components/radio/AnimeRadioScene";
import { AnimeRadioVisualizer } from "@/components/radio/AnimeRadioVisualizer";
import { BeatsPlaylistList, BeatsTrackSubmitForm } from "@/components/lounge/BeatsLoungePanels";
import { trackArtwork, type BeatsTrack } from "@/lib/animeBeatsLounge";
import { useAnimeRadio } from "@/providers/AnimeRadioProvider";
import { BeatsLoungeYoutubeSurface, useBeatsLounge } from "@/providers/BeatsLoungeProvider";
import { useLocale } from "@/providers/LocaleProvider";

type AnimeBeatsLoungeSectionProps = {
  initialPlaylist: BeatsTrack[];
};

export function AnimeBeatsLoungeSection({ initialPlaylist }: AnimeBeatsLoungeSectionProps) {
  const { t } = useLocale();
  const { pause: pauseRadio } = useAnimeRadio();
  const {
    playlist,
    currentTrack,
    isPlaying,
    isReady,
    playerError,
    setPlaylist,
    togglePlay,
    playNext,
    playPrevious,
    volume,
    muted,
    setVolume,
    toggleMute,
    playTrack,
  } = useBeatsLounge();

  useEffect(() => {
    setPlaylist(initialPlaylist);
  }, [initialPlaylist, setPlaylist]);

  function startPlayback(index = 0) {
    pauseRadio({ byUser: false });
    playTrack(index);
  }

  function handlePlayToggle() {
    pauseRadio({ byUser: false });
    if (currentTrack) {
      togglePlay();
    } else {
      startPlayback(0);
    }
  }

  function handlePlayTrack(index: number) {
    pauseRadio({ byUser: false });
    playTrack(index);
  }

  const artwork = currentTrack ? trackArtwork(currentTrack) : null;
  const title = currentTrack?.title ?? t.lounge.pickTrack;
  const artist = currentTrack?.artist ?? t.lounge.communityPlaylist;
  const trackKey = currentTrack?.id ?? "idle";

  return (
    <div className="relative space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-fuchsia-400/25 bg-gradient-to-br from-fuchsia-600/15 via-violet-950/40 to-black p-6 sm:p-8">
        <div className="pointer-events-none absolute -end-8 -top-8 h-32 w-32 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-fuchsia-300">
          {t.lounge.badge}
        </p>
        <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">{t.lounge.title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
          {t.lounge.subtitle}
        </p>
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/60 shadow-2xl shadow-black/50">
        <AnimeRadioScene active={isPlaying} accentFrom="#d946ef" accentTo="#7c3aed" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-fuchsia-950/20 via-black/50 to-black/70" />

        <div className="relative z-10 p-5 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/35 bg-fuchsia-500/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-100">
              <span
                className={`h-2 w-2 rounded-full bg-fuchsia-400 ${isPlaying ? "animate-[live-dot_1.2s_ease-in-out_infinite]" : "opacity-40"}`}
              />
              {isPlaying ? t.lounge.playing : t.lounge.communityPlaylist}
            </span>
            <AnimeRadioVisualizer active={isPlaying} />
          </div>

          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center">
            {artwork ? (
              <AnimeRadioArtwork
                src={artwork}
                alt={title}
                isPlaying={isPlaying}
                accentFrom="#d946ef"
                accentTo="#7c3aed"
              />
            ) : (
              <div className="flex h-44 w-44 items-center justify-center rounded-full border border-fuchsia-400/20 bg-gradient-to-br from-fuchsia-500/10 to-violet-600/10 text-5xl shadow-inner shadow-black/40">
                🎵
              </div>
            )}

            <div className="min-w-0 flex-1 text-center lg:text-start">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
                {t.lounge.nowPlaying}
              </p>
              <div key={trackKey} className="animate-[track-enter_0.45s_ease-out]">
                <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{title}</h3>
                <p className="mt-2 text-sm text-zinc-300 sm:text-base">{artist}</p>
                {currentTrack?.animeTitle ? (
                  <p className="mt-1 text-sm font-medium text-fuchsia-200">{currentTrack.animeTitle}</p>
                ) : null}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
                <button
                  type="button"
                  onClick={handlePlayToggle}
                  disabled={!isReady || playlist.length === 0}
                  className="inline-flex h-11 min-w-32 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-600 px-6 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/30 disabled:opacity-50"
                >
                  {isPlaying ? t.lounge.pause : t.lounge.play}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    pauseRadio({ byUser: false });
                    playPrevious();
                  }}
                  disabled={playlist.length === 0}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-sm"
                >
                  {t.lounge.previous}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    pauseRadio({ byUser: false });
                    playNext();
                  }}
                  disabled={playlist.length === 0}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-sm"
                >
                  {t.lounge.next}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-sm"
                >
                  {muted ? t.lounge.unmute : t.lounge.mute}
                </button>
              </div>

              <label className="mt-5 block max-w-md">
                <span className="mb-2 block text-xs font-medium text-zinc-400">{t.lounge.volume}</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={muted ? 0 : volume}
                  onChange={(event) => setVolume(Number(event.target.value))}
                  className="h-2 w-full cursor-pointer accent-fuchsia-500"
                />
              </label>

              <p className="mt-4 text-xs text-zinc-500">{t.lounge.keepListening}</p>

              {playerError ? (
                <p className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
                  {t.lounge.playbackError}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-6">
            <BeatsLoungeYoutubeSurface />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-2xl border border-white/10 bg-zinc-950/50 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
            {t.lounge.playlistTitle}
          </h3>
          <div className="mt-4">
            <BeatsPlaylistList onPlayTrack={handlePlayTrack} />
          </div>
        </section>

        <BeatsTrackSubmitForm />
      </div>
    </div>
  );
}
