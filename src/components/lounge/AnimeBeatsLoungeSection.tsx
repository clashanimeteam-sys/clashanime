"use client";

import { useEffect } from "react";
import { AnimeRadioArtwork } from "@/components/radio/AnimeRadioArtwork";
import { AnimeRadioScene } from "@/components/radio/AnimeRadioScene";
import { AnimeRadioVisualizer } from "@/components/radio/AnimeRadioVisualizer";
import { BeatsPlaylistList, BeatsTrackSubmitForm } from "@/components/lounge/BeatsLoungePanels";
import { trackArtwork, type BeatsTrack } from "@/lib/animeBeatsLounge";
import { useAnimeRadio } from "@/providers/AnimeRadioProvider";
import { useBeatsLounge } from "@/providers/BeatsLoungeProvider";
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
    needsUserAction,
    setPlaylist,
    togglePlay,
    playNext,
    playPrevious,
    volume,
    muted,
    setVolume,
    toggleMute,
    playTrack,
    unlockPlayback,
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
      <section className="relative overflow-hidden rounded-3xl border-2 border-fuchsia-500/40 bg-gradient-to-br from-fuchsia-600 via-violet-700 to-indigo-900 p-6 shadow-xl shadow-fuchsia-900/20 sm:p-8">
        <div className="pointer-events-none absolute -end-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-fuchsia-100">
          {t.lounge.badge}
        </p>
        <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">{t.lounge.title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fuchsia-50/95 sm:text-base">
          {t.lounge.subtitle}
        </p>
      </section>

      <section className="relative overflow-hidden rounded-3xl border-2 border-zinc-700 bg-zinc-900 shadow-2xl shadow-black/40">
        <AnimeRadioScene active={isPlaying} accentFrom="#e879f9" accentTo="#9333ea" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-fuchsia-900/30 via-zinc-950/80 to-zinc-950" />

        <div className="relative z-10 p-5 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/50 bg-fuchsia-500/25 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white">
                <span
                  className={`h-2 w-2 rounded-full bg-fuchsia-300 ${isPlaying ? "animate-[live-dot_1.2s_ease-in-out_infinite]" : "opacity-50"}`}
                />
                {isPlaying ? t.lounge.playing : t.lounge.communityPlaylist}
              </span>
              <span className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-100">
                {t.lounge.audioOnlyBadge}
              </span>
            </div>
            <AnimeRadioVisualizer active={isPlaying} />
          </div>

          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center">
            {artwork ? (
              <AnimeRadioArtwork
                src={artwork}
                alt={title}
                isPlaying={isPlaying}
                accentFrom="#e879f9"
                accentTo="#9333ea"
              />
            ) : (
              <div className="flex h-44 w-44 items-center justify-center rounded-full border-2 border-fuchsia-400/40 bg-gradient-to-br from-fuchsia-500/20 to-violet-700/30 text-5xl shadow-lg shadow-fuchsia-500/20">
                🎵
              </div>
            )}

            <div className="min-w-0 flex-1 text-center lg:text-start">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-300">
                {t.lounge.nowPlaying}
              </p>
              <div key={trackKey} className="animate-[track-enter_0.45s_ease-out]">
                <h3
                  dir="auto"
                  className="mt-2 text-2xl font-bold leading-snug text-white sm:text-3xl [overflow-wrap:anywhere]"
                >
                  {title}
                </h3>
                <p dir="auto" className="mt-2 text-base text-zinc-200 [overflow-wrap:anywhere]">
                  {artist}
                </p>
                {currentTrack?.animeTitle ? (
                  <p dir="auto" className="mt-1 text-sm font-semibold text-fuchsia-300 [overflow-wrap:anywhere]">
                    {currentTrack.animeTitle}
                  </p>
                ) : null}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
                <button
                  type="button"
                  onClick={handlePlayToggle}
                  disabled={playlist.length === 0}
                  className="inline-flex h-12 min-w-36 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-600 px-7 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/40 transition hover:brightness-110 disabled:opacity-50"
                >
                  {!isReady ? t.lounge.playerLoading : isPlaying ? t.lounge.pause : t.lounge.play}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    pauseRadio({ byUser: false });
                    playPrevious();
                  }}
                  disabled={playlist.length === 0}
                  className="rounded-full border-2 border-zinc-500 bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-fuchsia-400 hover:bg-zinc-700 disabled:opacity-50"
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
                  className="rounded-full border-2 border-zinc-500 bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-fuchsia-400 hover:bg-zinc-700 disabled:opacity-50"
                >
                  {t.lounge.next}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  className="rounded-full border-2 border-zinc-500 bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-fuchsia-400 hover:bg-zinc-700"
                >
                  {muted ? t.lounge.unmute : t.lounge.mute}
                </button>
              </div>

              <label className="mt-5 block max-w-md">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-zinc-300">
                  {t.lounge.volume}
                </span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={muted ? 0 : volume}
                  onChange={(event) => setVolume(Number(event.target.value))}
                  className="h-2.5 w-full cursor-pointer accent-fuchsia-400"
                />
              </label>

              <p className="mt-4 text-sm text-zinc-300">{t.lounge.backgroundListening}</p>
              <p className="mt-2 text-xs text-zinc-400">{t.lounge.audioSourceHint}</p>

              {needsUserAction ? (
                <button
                  type="button"
                  onClick={unlockPlayback}
                  className="mt-3 w-full max-w-md rounded-xl border-2 border-amber-400/50 bg-amber-500/20 px-4 py-3 text-sm font-bold text-amber-100 transition hover:bg-amber-500/30"
                >
                  {t.lounge.unlockAudio}
                </button>
              ) : null}

              {playerError ? (
                <p className="mt-3 rounded-xl border border-amber-400/40 bg-amber-500/15 px-3 py-2 text-sm font-medium text-amber-100">
                  {t.lounge.playbackError}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-5 shadow-lg">
          <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-fuchsia-300">
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
