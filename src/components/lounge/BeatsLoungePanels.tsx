"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { trackArtwork, type BeatsTrack } from "@/lib/animeBeatsLounge";
import { createBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useBeatsLounge } from "@/providers/BeatsLoungeProvider";
import { useLocale } from "@/providers/LocaleProvider";

type BeatsPlaylistListProps = {
  onVote?: () => void;
};

export function BeatsPlaylistList({ onVote }: BeatsPlaylistListProps) {
  const { t } = useLocale();
  const { user } = useAuth();
  const supabase = createBrowserClient();
  const { playlist, currentIndex, playTrack, refreshVote } = useBeatsLounge();
  const [votingId, setVotingId] = useState<string | null>(null);

  async function handleVote(track: BeatsTrack) {
    if (!user || !supabase) return;

    setVotingId(track.id);
    const { data, error } = await supabase.rpc("toggle_anime_beats_vote", {
      p_track_id: track.id,
    });

    if (!error) {
      refreshVote(
        track.id,
        track.userHasVoted ? track.voteCount - 1 : track.voteCount + 1,
        Boolean(data),
      );
      onVote?.();
    }

    setVotingId(null);
  }

  if (playlist.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-white/15 bg-black/30 px-4 py-6 text-sm text-zinc-300">
        {t.lounge.emptyPlaylist}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {playlist.map((track, index) => {
        const active = index === currentIndex;

        return (
          <div
            key={track.id}
            className={`flex items-center gap-3 rounded-2xl border p-3 transition-colors ${
              active
                ? "border-fuchsia-400/50 bg-fuchsia-500/10"
                : "border-white/10 bg-black/35 hover:border-white/20"
            }`}
          >
            <button
              type="button"
              onClick={() => playTrack(index)}
              className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl"
            >
              <Image
                src={trackArtwork(track)}
                alt=""
                fill
                className="object-cover"
                sizes="80px"
                unoptimized
              />
            </button>

            <button type="button" onClick={() => playTrack(index)} className="min-w-0 flex-1 text-start">
              <p className="truncate text-sm font-bold text-white">{track.title}</p>
              <p className="truncate text-xs text-zinc-300">{track.artist}</p>
              {track.animeTitle ? (
                <p className="truncate text-[11px] text-fuchsia-200/80">{track.animeTitle}</p>
              ) : null}
            </button>

            <div className="flex shrink-0 flex-col items-end gap-2">
              <button
                type="button"
                disabled={!user || votingId === track.id}
                onClick={() => void handleVote(track)}
                className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                  track.userHasVoted
                    ? "bg-fuchsia-500 text-white"
                    : "border border-white/20 text-zinc-200"
                } disabled:opacity-50`}
                title={user ? t.lounge.voteTrack : t.lounge.loginToVote}
              >
                ♥ {track.voteCount}
              </button>
              {active ? (
                <span className="text-[10px] font-bold uppercase tracking-wide text-fuchsia-300">
                  {t.lounge.nowPlayingBadge}
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function BeatsTrackSubmitForm() {
  const { t } = useLocale();
  const { user } = useAuth();
  const supabase = createBrowserClient();
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [animeTitle, setAnimeTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !supabase) return;

    setSaving(true);
    setMessage(null);
    setError(null);

    const { error: submitError } = await supabase.rpc("submit_anime_beats_track", {
      p_title: title.trim(),
      p_artist: artist.trim(),
      p_youtube_input: youtubeUrl.trim(),
      p_anime_title: animeTitle.trim() || null,
    });

    setSaving(false);

    if (submitError) {
      setError(submitError.message);
      return;
    }

    setTitle("");
    setArtist("");
    setAnimeTitle("");
    setYoutubeUrl("");
    setMessage(t.lounge.submitSuccess);
  }

  if (!user) {
    return (
      <p className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-sm text-zinc-300">
        {t.lounge.loginToSubmit}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-white/10 bg-black/35 p-4">
      <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-fuchsia-300">
        {t.lounge.submitTitle}
      </h3>
      <p className="text-xs text-zinc-400">{t.lounge.submitDesc}</p>

      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder={t.lounge.trackTitlePlaceholder}
        className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm text-white"
        required
      />
      <input
        value={artist}
        onChange={(event) => setArtist(event.target.value)}
        placeholder={t.lounge.artistPlaceholder}
        className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm text-white"
        required
      />
      <input
        value={animeTitle}
        onChange={(event) => setAnimeTitle(event.target.value)}
        placeholder={t.lounge.animePlaceholder}
        className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm text-white"
      />
      <input
        value={youtubeUrl}
        onChange={(event) => setYoutubeUrl(event.target.value)}
        placeholder={t.lounge.youtubePlaceholder}
        className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm text-white"
        required
      />

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-fuchsia-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {saving ? t.lounge.submitting : t.lounge.submitButton}
      </button>

      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </form>
  );
}
