"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { buildMatchTagsFromTitle } from "@/lib/animeTracker";
import { useLocale } from "@/providers/LocaleProvider";

type ReleaseRow = {
  id: string;
  title: string;
  title_ar: string | null;
  title_ja: string | null;
  anilist_id: number | null;
  release_date: string;
  airs_at: string | null;
  episode_number: number;
  poster_url: string | null;
  match_tags: string[];
  status: "scheduled" | "released" | "cancelled";
  source: string;
  clash_id: string | null;
  notes: string | null;
  created_at: string;
};

export function AdminAnimeTrackerPanel() {
  const { t, formatDateTime } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [releases, setReleases] = useState<ReleaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [titleJa, setTitleJa] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("1");
  const [posterUrl, setPosterUrl] = useState("");
  const [matchTags, setMatchTags] = useState("");
  const [openClash, setOpenClash] = useState(false);

  const loadReleases = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error: listError } = await supabase.rpc("list_anime_releases_admin");
    if (listError) {
      setError(listError.message);
      setReleases([]);
    } else {
      setReleases((data as ReleaseRow[]) ?? []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void loadReleases();
  }, [loadReleases]);

  const todayCount = releases.filter((release) => release.release_date === new Date().toISOString().slice(0, 10)).length;
  const upcomingCount = releases.filter(
    (release) => release.status === "scheduled" && release.release_date > new Date().toISOString().slice(0, 10),
  ).length;
  const activeClashCount = releases.filter((release) => release.clash_id && release.status === "released").length;

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    setSaving(true);
    setMessage(null);
    setError(null);

    const tags = matchTags
      .split(/[,\s]+/)
      .map((tag) => tag.trim())
      .filter(Boolean);

    const { error: createError } = await supabase.rpc("create_anime_release_admin", {
      p_title: title.trim(),
      p_release_date: releaseDate,
      p_title_ar: titleAr.trim() || null,
      p_title_ja: titleJa.trim() || null,
      p_episode_number: Number(episodeNumber) || 1,
      p_poster_url: posterUrl.trim() || null,
      p_match_tags: tags.length ? tags : buildMatchTagsFromTitle(title.trim()),
      p_open_clash: openClash,
    });

    setSaving(false);

    if (createError) {
      setError(createError.message);
      return;
    }

    setTitle("");
    setTitleAr("");
    setTitleJa("");
    setReleaseDate("");
    setEpisodeNumber("1");
    setPosterUrl("");
    setMatchTags("");
    setOpenClash(false);
    setMessage(t.admin.animeTracker.created);
    await loadReleases();
  }

  async function handleSync() {
    setSyncing(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/anime-tracker/sync", { method: "POST" });
      const payload = (await response.json()) as {
        error?: string;
        synced?: number;
        clashesOpened?: number;
      };

      if (!response.ok) {
        setError(payload.error ?? t.admin.animeTracker.syncFailed);
        return;
      }

      setMessage(
        t.admin.animeTracker.syncSuccess
          .replace("{synced}", String(payload.synced ?? 0))
          .replace("{opened}", String(payload.clashesOpened ?? 0)),
      );
      await loadReleases();
    } catch {
      setError(t.admin.animeTracker.syncFailed);
    } finally {
      setSyncing(false);
    }
  }

  async function openClashForRelease(id: string) {
    if (!supabase) return;
    setSaving(true);
    setMessage(null);
    setError(null);

    const { data, error: openError } = await supabase.rpc("open_anime_release_clash_admin", {
      p_release_id: id,
    });

    setSaving(false);

    if (openError) {
      setError(openError.message);
      return;
    }

    setMessage(t.admin.animeTracker.clashOpened.replace("{id}", String(data ?? "")));
    await loadReleases();
  }

  async function deleteRelease(id: string) {
    if (!supabase || !window.confirm(t.admin.animeTracker.deleteConfirm)) return;
    setSaving(true);
    const { error: deleteError } = await supabase.rpc("delete_anime_release_admin", { p_id: id });
    setSaving(false);
    if (deleteError) setError(deleteError.message);
    else await loadReleases();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{t.admin.animeTracker.title}</h1>
          <p className="mt-2 text-sm text-zinc-400">{t.admin.animeTracker.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => void handleSync()}
          disabled={syncing || saving}
          className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
        >
          {syncing ? t.admin.animeTracker.syncing : t.admin.animeTracker.syncButton}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-violet-500/30 bg-violet-950/20 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-violet-300">{t.admin.animeTracker.todayCount}</p>
          <p className="mt-2 text-3xl font-bold text-white">{todayCount}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">{t.admin.animeTracker.upcomingCount}</p>
          <p className="mt-2 text-3xl font-bold text-white">{upcomingCount}</p>
        </div>
        <div className="rounded-2xl border border-orange-500/30 bg-orange-950/20 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-orange-300">{t.admin.animeTracker.activeClashes}</p>
          <p className="mt-2 text-3xl font-bold text-white">{activeClashCount}</p>
        </div>
      </div>

      {message ? <p className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-4 py-3 text-sm text-emerald-200">{message}</p> : null}
      {error ? <p className="rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm text-red-200">{error}</p> : null}

      <form onSubmit={handleCreate} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h2 className="text-lg font-semibold text-white">{t.admin.animeTracker.addTitle}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t.admin.animeTracker.titleLabel} className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" required />
          <input value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} type="date" className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" required />
          <input value={titleAr} onChange={(e) => setTitleAr(e.target.value)} placeholder={t.admin.animeTracker.titleArLabel} className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          <input value={titleJa} onChange={(e) => setTitleJa(e.target.value)} placeholder={t.admin.animeTracker.titleJaLabel} className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          <input value={episodeNumber} onChange={(e) => setEpisodeNumber(e.target.value)} placeholder={t.admin.animeTracker.episodeLabel} className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          <input value={posterUrl} onChange={(e) => setPosterUrl(e.target.value)} placeholder={t.admin.animeTracker.posterLabel} className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          <input value={matchTags} onChange={(e) => setMatchTags(e.target.value)} placeholder={t.admin.animeTracker.tagsLabel} className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm sm:col-span-2" />
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" checked={openClash} onChange={(e) => setOpenClash(e.target.checked)} />
          {t.admin.animeTracker.openClashNow}
        </label>
        <button type="submit" disabled={saving} className="mt-4 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">
          {t.admin.animeTracker.addButton}
        </button>
      </form>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h2 className="text-lg font-semibold text-white">{t.admin.animeTracker.listTitle}</h2>
        {loading ? (
          <p className="mt-4 text-sm text-zinc-400">{t.admin.loading}</p>
        ) : releases.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-400">{t.admin.animeTracker.empty}</p>
        ) : (
          <div className="mt-4 space-y-3">
            {releases.map((release) => (
              <div key={release.id} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{release.title}</p>
                    <p className="mt-1 text-xs text-zinc-400">
                      {release.release_date} · Ep {release.episode_number} · {release.status} · {release.source}
                    </p>
                    {release.airs_at ? (
                      <p className="mt-1 text-xs text-zinc-500">
                        {formatDateTime(release.airs_at, { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    ) : null}
                    {release.match_tags?.length ? (
                      <p className="mt-2 text-xs text-violet-300">{release.match_tags.map((tag) => `#${tag}`).join(" ")}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {!release.clash_id ? (
                      <button
                        type="button"
                        onClick={() => void openClashForRelease(release.id)}
                        disabled={saving}
                        className="rounded-full bg-orange-600 px-3 py-1.5 text-xs font-bold text-white"
                      >
                        {t.admin.animeTracker.openClashButton}
                      </button>
                    ) : (
                      <a
                        href={`/tracker/clash/${release.clash_id}`}
                        className="rounded-full border border-orange-500/40 px-3 py-1.5 text-xs font-bold text-orange-200"
                      >
                        {t.admin.animeTracker.viewClash}
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => void deleteRelease(release.id)}
                      disabled={saving}
                      className="rounded-full border border-red-500/40 px-3 py-1.5 text-xs font-bold text-red-200"
                    >
                      {t.admin.animeTracker.deleteButton}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
