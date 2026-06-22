"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { useLocale } from "@/providers/LocaleProvider";

type TrackRow = {
  id: string;
  title: string;
  artist: string;
  anime_title: string | null;
  youtube_video_id: string;
  status: "pending" | "approved" | "rejected";
  sort_order: number;
  vote_count: number;
  review_note: string | null;
  created_at: string;
};

export function AdminBeatsLoungePanel() {
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [tracks, setTracks] = useState<TrackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [animeTitle, setAnimeTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [sortOrder, setSortOrder] = useState("100");

  const loadTracks = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error: listError } = await supabase.rpc("list_anime_beats_tracks_admin");
    if (listError) {
      setError(listError.message);
      setTracks([]);
    } else {
      setTracks((data as TrackRow[]) ?? []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void loadTracks();
  }, [loadTracks]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    setSaving(true);
    setMessage(null);
    setError(null);

    const { error: createError } = await supabase.rpc("create_anime_beats_track_admin", {
      p_title: title.trim(),
      p_artist: artist.trim(),
      p_youtube_input: youtubeUrl.trim(),
      p_anime_title: animeTitle.trim() || null,
      p_sort_order: Number(sortOrder) || 100,
      p_approve: true,
    });

    setSaving(false);

    if (createError) {
      setError(createError.message);
      return;
    }

    setTitle("");
    setArtist("");
    setAnimeTitle("");
    setYoutubeUrl("");
    setMessage(t.admin.beatsLounge.created);
    await loadTracks();
  }

  async function reviewTrack(id: string, status: "approved" | "rejected") {
    if (!supabase) return;
    setSaving(true);
    setMessage(null);
    setError(null);

    const { error: reviewError } = await supabase.rpc("review_anime_beats_track", {
      p_id: id,
      p_status: status,
      p_sort_order: status === "approved" ? 100 : null,
      p_review_note: null,
    });

    setSaving(false);

    if (reviewError) setError(reviewError.message);
    else {
      setMessage(status === "approved" ? t.admin.beatsLounge.approved : t.admin.beatsLounge.rejected);
      await loadTracks();
    }
  }

  async function deleteTrack(id: string) {
    if (!supabase || !window.confirm(t.admin.beatsLounge.deleteConfirm)) return;
    setSaving(true);
    const { error: deleteError } = await supabase.rpc("delete_anime_beats_track", { p_id: id });
    setSaving(false);
    if (deleteError) setError(deleteError.message);
    else await loadTracks();
  }

  const pending = tracks.filter((track) => track.status === "pending");
  const approved = tracks.filter((track) => track.status === "approved");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.admin.beatsLounge.title}</h1>
        <p className="mt-2 text-sm text-zinc-400">{t.admin.beatsLounge.subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-fuchsia-500/30 bg-fuchsia-950/20 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-fuchsia-300">{t.admin.beatsLounge.pendingCount}</p>
          <p className="mt-2 text-3xl font-bold text-white">{pending.length}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">{t.admin.beatsLounge.approvedCount}</p>
          <p className="mt-2 text-3xl font-bold text-white">{approved.length}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">{t.admin.beatsLounge.totalVotes}</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {tracks.reduce((sum, track) => sum + track.vote_count, 0)}
          </p>
        </div>
      </div>

      <form onSubmit={handleCreate} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h2 className="text-lg font-semibold text-white">{t.admin.beatsLounge.addTrackTitle}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t.admin.beatsLounge.titleLabel} className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" required />
          <input value={artist} onChange={(e) => setArtist(e.target.value)} placeholder={t.admin.beatsLounge.artistLabel} className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" required />
          <input value={animeTitle} onChange={(e) => setAnimeTitle(e.target.value)} placeholder={t.admin.beatsLounge.animeLabel} className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          <input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder={t.admin.beatsLounge.youtubeLabel} className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" required />
          <input value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} placeholder={t.admin.beatsLounge.sortLabel} className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
        </div>
        <button type="submit" disabled={saving} className="mt-4 rounded-full bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
          {t.admin.beatsLounge.addButton}
        </button>
      </form>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h2 className="text-lg font-semibold text-white">{t.admin.beatsLounge.queueTitle}</h2>
        {loading ? (
          <p className="mt-4 text-sm text-zinc-400">{t.admin.loading}</p>
        ) : tracks.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-400">{t.admin.beatsLounge.empty}</p>
        ) : (
          <div className="mt-4 space-y-3">
            {tracks.map((track) => (
              <div key={track.id} className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{track.title}</p>
                    <p className="mt-1 text-sm text-zinc-300">{track.artist}</p>
                    {track.anime_title ? <p className="text-xs text-fuchsia-300">{track.anime_title}</p> : null}
                    <p className="mt-2 text-xs text-zinc-500">
                      {track.status} · ♥ {track.vote_count} · order {track.sort_order}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {track.status === "pending" ? (
                      <>
                        <button type="button" onClick={() => void reviewTrack(track.id, "approved")} disabled={saving} className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">
                          {t.admin.beatsLounge.approveButton}
                        </button>
                        <button type="button" onClick={() => void reviewTrack(track.id, "rejected")} disabled={saving} className="rounded-full bg-red-700 px-3 py-1.5 text-xs font-semibold text-white">
                          {t.admin.beatsLounge.rejectButton}
                        </button>
                      </>
                    ) : null}
                    <button type="button" onClick={() => void deleteTrack(track.id)} disabled={saving} className="rounded-full border border-red-800 px-3 py-1.5 text-xs text-red-300">
                      {t.admin.beatsLounge.deleteButton}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
