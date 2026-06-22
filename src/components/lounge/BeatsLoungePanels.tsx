"use client";

import Image from "next/image";
import { FormEvent, useEffect, useRef, useState, type ReactNode } from "react";
import {
  isValidArtworkUrl,
  mapBeatsSubmitError,
  trackArtwork,
  uploadBeatsCoverImage,
  validateBeatsCoverFile,
  validateBeatsSubmission,
  type BeatsTrack,
} from "@/lib/animeBeatsLounge";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useBeatsLounge } from "@/providers/BeatsLoungeProvider";
import { useLocale } from "@/providers/LocaleProvider";

type BeatsPlaylistListProps = {
  onVote?: () => void;
  onPlayTrack?: (index: number) => void;
};

function LoungeField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-fuchsia-300">
        {label}
      </span>
      {children}
    </label>
  );
}

const fieldClass =
  "w-full rounded-xl border-2 border-zinc-600 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-400 shadow-inner shadow-black/20 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-500/25";

export function BeatsPlaylistList({ onVote, onPlayTrack }: BeatsPlaylistListProps) {
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
      <div className="rounded-2xl border border-dashed border-fuchsia-300/25 bg-gradient-to-br from-fuchsia-950/20 via-black/30 to-violet-950/20 px-5 py-8 text-center">
        <p className="text-3xl" aria-hidden>
          🎧
        </p>
        <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-300">
          {t.lounge.emptyPlaylist}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {playlist.map((track, index) => {
        const active = index === currentIndex;

        return (
          <div
            key={track.id}
            className={`group flex items-center gap-3 rounded-2xl border-2 p-3 transition-all ${
              active
                ? "border-fuchsia-400 bg-gradient-to-r from-fuchsia-500/25 via-fuchsia-500/10 to-transparent shadow-lg shadow-fuchsia-500/15"
                : "border-zinc-600 bg-zinc-950 hover:border-fuchsia-400/50 hover:bg-zinc-900"
            }`}
          >
            <span className="w-6 shrink-0 text-center text-xs font-bold text-zinc-500">
              {index + 1}
            </span>

            <button
              type="button"
              onClick={() => (onPlayTrack ? onPlayTrack(index) : playTrack(index))}
              className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10 transition group-hover:ring-fuchsia-400/40"
            >
              <Image
                src={trackArtwork(track)}
                alt=""
                fill
                className="object-cover"
                sizes="80px"
                unoptimized
              />
              {active ? (
                <span className="absolute inset-0 flex items-center justify-center bg-black/35 text-[10px] font-bold uppercase text-fuchsia-200">
                  ▶
                </span>
              ) : null}
            </button>

            <button
              type="button"
              onClick={() => (onPlayTrack ? onPlayTrack(index) : playTrack(index))}
              className="min-w-0 flex-1 text-start"
            >
              <p dir="auto" className="truncate text-sm font-bold text-white">
                {track.title}
              </p>
              <p dir="auto" className="truncate text-xs text-zinc-300">
                {track.artist}
              </p>
              {track.animeTitle ? (
                <p dir="auto" className="truncate text-[11px] font-medium text-fuchsia-300">
                  {track.animeTitle}
                </p>
              ) : null}
            </button>

            <div className="flex shrink-0 flex-col items-end gap-2">
              <button
                type="button"
                disabled={!user || votingId === track.id}
                onClick={() => void handleVote(track)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                  track.userHasVoted
                    ? "bg-fuchsia-500 text-white shadow-md shadow-fuchsia-500/30"
                    : "border border-white/15 bg-white/5 text-zinc-200 hover:border-fuchsia-400/40"
                } disabled:opacity-50`}
                title={user ? t.lounge.voteTrack : t.lounge.loginToVote}
              >
                ♥ {track.voteCount}
              </button>
              {active ? (
                <span className="rounded-full bg-fuchsia-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-fuchsia-200">
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
  const [artworkUrl, setArtworkUrl] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverFilePreview, setCoverFilePreview] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const errorLabels = {
    errorTitleRequired: t.lounge.errorTitleRequired,
    errorArtistRequired: t.lounge.errorArtistRequired,
    errorYoutubeRequired: t.lounge.errorYoutubeRequired,
    errorYoutubeInvalid: t.lounge.errorYoutubeInvalid,
    errorCoverInvalid: t.lounge.errorCoverInvalid,
    loginToSubmit: t.lounge.loginToSubmit,
  };

  const coverPreview =
    coverFilePreview ??
    (isValidArtworkUrl(artworkUrl) && artworkUrl.trim() ? artworkUrl.trim() : null);

  useEffect(() => {
    return () => {
      if (coverFilePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(coverFilePreview);
      }
    };
  }, [coverFilePreview]);

  function clearCoverSelection() {
    if (coverFilePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(coverFilePreview);
    }
    setCoverFile(null);
    setCoverFilePreview(null);
    setArtworkUrl("");
    if (coverInputRef.current) coverInputRef.current.value = "";
  }

  function handleCoverFileSelect(file: File | null) {
    if (!file) return;

    const fileError = validateBeatsCoverFile(file);
    if (fileError === "invalid") {
      setError(t.communityFeed.invalidImage);
      setMessage(null);
      return;
    }
    if (fileError === "tooLarge") {
      setError(t.communityFeed.imageTooLarge);
      setMessage(null);
      return;
    }

    if (coverFilePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(coverFilePreview);
    }

    setCoverFile(file);
    setCoverFilePreview(URL.createObjectURL(file));
    setArtworkUrl("");
    setError(null);
  }

  function handleArtworkUrlChange(value: string) {
    if (coverFile || coverFilePreview) {
      if (coverFilePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(coverFilePreview);
      }
      setCoverFile(null);
      setCoverFilePreview(null);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
    setArtworkUrl(value);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !supabase) return;

    const clientError = validateBeatsSubmission({
      title,
      artist,
      youtubeUrl,
      artworkUrl,
      errors: errorLabels,
    });

    if (clientError) {
      setError(clientError);
      setMessage(null);
      return;
    }

    setSaving(true);
    setMessage(null);
    setError(null);

    const config = getSupabaseConfig();
    let resolvedArtworkUrl = artworkUrl.trim() || null;

    if (coverFile) {
      if (!config) {
        setSaving(false);
        setError(t.lounge.coverUploadFailed);
        return;
      }

      try {
        resolvedArtworkUrl = await uploadBeatsCoverImage(supabase, config, user.id, coverFile);
      } catch {
        setSaving(false);
        setError(t.lounge.coverUploadFailed);
        return;
      }
    }

    const { error: submitError } = await supabase.rpc("submit_anime_beats_track", {
      p_title: title.trim(),
      p_artist: artist.trim(),
      p_youtube_input: youtubeUrl.trim(),
      p_anime_title: animeTitle.trim() || null,
      p_artwork_url: resolvedArtworkUrl,
    });

    setSaving(false);

    if (submitError) {
      setError(mapBeatsSubmitError(submitError.message, errorLabels));
      return;
    }

    setTitle("");
    setArtist("");
    setAnimeTitle("");
    setYoutubeUrl("");
    clearCoverSelection();
    setMessage(t.lounge.submitSuccess);
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-fuchsia-300/20 bg-gradient-to-br from-fuchsia-950/25 to-violet-950/20 px-5 py-6">
        <p className="text-sm leading-relaxed text-zinc-300">{t.lounge.loginToSubmit}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-5 shadow-xl"
    >
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-300">
          {t.lounge.submitTitle}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-300">{t.lounge.submitDesc}</p>
      </div>

      <div className="space-y-3">
        <LoungeField label={t.lounge.trackTitlePlaceholder}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={t.lounge.trackTitlePlaceholder}
            className={fieldClass}
            autoComplete="off"
          />
        </LoungeField>

        <LoungeField label={t.lounge.artistPlaceholder}>
          <input
            value={artist}
            onChange={(event) => setArtist(event.target.value)}
            placeholder={t.lounge.artistPlaceholder}
            className={fieldClass}
            autoComplete="off"
          />
        </LoungeField>

        <LoungeField label={t.lounge.animePlaceholder}>
          <input
            value={animeTitle}
            onChange={(event) => setAnimeTitle(event.target.value)}
            placeholder={t.lounge.animePlaceholder}
            className={fieldClass}
            autoComplete="off"
          />
        </LoungeField>

        <LoungeField label={t.lounge.youtubePlaceholder}>
          <input
            value={youtubeUrl}
            onChange={(event) => setYoutubeUrl(event.target.value)}
            placeholder="https://youtu.be/..."
            className={fieldClass}
            inputMode="url"
            autoComplete="off"
          />
        </LoungeField>

        <LoungeField label={t.lounge.coverPlaceholder}>
          <div className="space-y-3">
            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-fuchsia-400/50 bg-fuchsia-500/10 px-4 py-3 text-sm font-semibold text-fuchsia-100 transition hover:border-fuchsia-300 hover:bg-fuchsia-500/15">
              {t.lounge.coverFromLibrary}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleCoverFileSelect(event.target.files?.[0] ?? null)}
              />
            </label>

            <p className="text-center text-xs font-medium text-zinc-400">{t.lounge.coverOrLink}</p>

            <input
              value={artworkUrl}
              onChange={(event) => handleArtworkUrlChange(event.target.value)}
              placeholder="https://..."
              className={fieldClass}
              inputMode="url"
              autoComplete="off"
              disabled={Boolean(coverFile)}
            />
          </div>

          {coverPreview ? (
            <div className="mt-3 flex items-center gap-3 rounded-xl border-2 border-zinc-600 bg-zinc-950 p-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg ring-2 ring-fuchsia-400/40">
                <Image
                  src={coverPreview}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="64px"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-zinc-300">
                  {coverFile ? t.lounge.coverFromLibrary : t.lounge.coverPlaceholder}
                </p>
                <button
                  type="button"
                  onClick={clearCoverSelection}
                  className="mt-1 text-xs font-semibold text-fuchsia-300 hover:text-fuchsia-200"
                >
                  {t.lounge.coverRemove}
                </button>
              </div>
            </div>
          ) : null}
        </LoungeField>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="mt-5 w-full rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/25 transition hover:brightness-110 disabled:opacity-50"
      >
        {saving ? t.lounge.submitting : t.lounge.submitButton}
      </button>

      {message ? (
        <p className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}
    </form>
  );
}
