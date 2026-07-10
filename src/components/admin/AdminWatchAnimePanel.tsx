"use client";

import { useEffect, useState } from "react";
import type { WatchSourceRow } from "@/lib/watchAdmin";
import { useLocale } from "@/providers/LocaleProvider";

export function AdminWatchAnimePanel() {
  const { t } = useLocale();
  const [sources, setSources] = useState<WatchSourceRow[]>([]);
  const [autoEnabled, setAutoEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    mal_id: "",
    content_type: "movie" as "episode" | "movie",
    episode_number: "1",
    label: "ClashAnime",
    stream_type: "hls" as "embed" | "hls" | "mp4",
    embed_url: "",
    subtitle_url: "",
    referer: "",
    qualities_json: "",
  });

  async function load() {
    setLoading(true);
    const response = await fetch("/api/admin/watch-sources");
    const payload = (await response.json()) as {
      sources?: WatchSourceRow[];
      autoProvidersEnabled?: boolean;
      error?: string;
    };
    if (!response.ok) {
      setError(payload.error ?? "Failed to load");
      setLoading(false);
      return;
    }
    setSources(payload.sources ?? []);
    setAutoEnabled(Boolean(payload.autoProvidersEnabled));
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    let qualities: Array<{ label: string; url: string }> | null = null;
    if (form.qualities_json.trim()) {
      try {
        qualities = JSON.parse(form.qualities_json) as Array<{ label: string; url: string }>;
      } catch {
        setError("Invalid qualities JSON");
        return;
      }
    }

    const response = await fetch("/api/admin/watch-sources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mal_id: Number(form.mal_id),
        content_type: form.content_type,
        episode_number: form.content_type === "episode" ? Number(form.episode_number) : null,
        label: form.label,
        stream_type: form.stream_type,
        embed_url: form.embed_url,
        subtitle_url: form.subtitle_url || null,
        referer: form.referer || null,
        qualities,
      }),
    });

    const payload = (await response.json()) as { source?: WatchSourceRow; error?: string };
    if (!response.ok) {
      setError(payload.error ?? "Failed to save");
      return;
    }

    if (payload.source) setSources((current) => [payload.source!, ...current]);
    setMessage(t.admin.watchAnimeSaved);
    setForm((current) => ({ ...current, embed_url: "", subtitle_url: "", qualities_json: "" }));
  }

  async function handleDelete(id: string) {
    if (!window.confirm(t.admin.watchAnimeDeleteConfirm)) return;
    const response = await fetch(`/api/admin/watch-sources?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!response.ok) return;
    setSources((current) => current.filter((source) => source.id !== id));
  }

  async function toggleAuto() {
    const response = await fetch("/api/admin/watch-sources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !autoEnabled }),
    });
    const payload = (await response.json()) as { autoProvidersEnabled?: boolean };
    if (response.ok) {
      setAutoEnabled(Boolean(payload.autoProvidersEnabled));
      setMessage(payload.autoProvidersEnabled ? t.admin.watchAnimeAutoOn : t.admin.watchAnimeAutoOff);
    }
  }

  if (loading) {
    return <p className="text-sm text-zinc-400">{t.admin.watchAnimeLoading}</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.admin.watchAnimeTitle}</h1>
        <p className="mt-2 text-sm text-zinc-400">{t.admin.watchAnimeSubtitle}</p>
      </div>

      <section className="rounded-2xl border border-violet-500/20 bg-violet-950/20 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-white">{t.admin.watchAnimeAutoTitle}</h2>
            <p className="mt-1 text-sm text-zinc-400">{t.admin.watchAnimeAutoHint}</p>
          </div>
          <button
            type="button"
            onClick={() => void toggleAuto()}
            className={`rounded-full px-5 py-2 text-sm font-semibold ${
              autoEnabled ? "bg-emerald-500 text-black" : "border border-zinc-700 text-zinc-300"
            }`}
          >
            {autoEnabled ? t.admin.watchAnimeAutoOn : t.admin.watchAnimeAutoOff}
          </button>
        </div>
      </section>

      <form onSubmit={handleCreate} className="grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 md:grid-cols-2">
        <label className="text-sm text-zinc-300">
          MAL ID
          <input
            required
            value={form.mal_id}
            onChange={(event) => setForm({ ...form, mal_id: event.target.value })}
            className="mt-1 w-full rounded-xl border border-zinc-800 bg-black px-3 py-2 text-white"
          />
        </label>
        <label className="text-sm text-zinc-300">
          {t.admin.watchAnimeType}
          <select
            value={form.content_type}
            onChange={(event) =>
              setForm({ ...form, content_type: event.target.value as "episode" | "movie" })
            }
            className="mt-1 w-full rounded-xl border border-zinc-800 bg-black px-3 py-2 text-white"
          >
            <option value="episode">{t.admin.watchAnimeEpisode}</option>
            <option value="movie">{t.admin.watchAnimeMovie}</option>
          </select>
        </label>
        {form.content_type === "episode" ? (
          <label className="text-sm text-zinc-300">
            {t.admin.watchAnimeEpisodeNumber}
            <input
              required
              type="number"
              min={1}
              value={form.episode_number}
              onChange={(event) => setForm({ ...form, episode_number: event.target.value })}
              className="mt-1 w-full rounded-xl border border-zinc-800 bg-black px-3 py-2 text-white"
            />
          </label>
        ) : null}
        <label className="text-sm text-zinc-300">
          {t.admin.watchAnimeStreamType}
          <select
            value={form.stream_type}
            onChange={(event) =>
              setForm({ ...form, stream_type: event.target.value as "embed" | "hls" | "mp4" })
            }
            className="mt-1 w-full rounded-xl border border-zinc-800 bg-black px-3 py-2 text-white"
          >
            <option value="hls">HLS / m3u8</option>
            <option value="mp4">MP4</option>
            <option value="embed">Embed</option>
          </select>
        </label>
        <label className="text-sm text-zinc-300 md:col-span-2">
          {t.admin.watchAnimeStreamUrl}
          <input
            required
            type="url"
            value={form.embed_url}
            onChange={(event) => setForm({ ...form, embed_url: event.target.value })}
            className="mt-1 w-full rounded-xl border border-zinc-800 bg-black px-3 py-2 text-white"
          />
        </label>
        <label className="text-sm text-zinc-300 md:col-span-2">
          {t.admin.watchAnimeSubtitleUrl}
          <input
            type="url"
            value={form.subtitle_url}
            onChange={(event) => setForm({ ...form, subtitle_url: event.target.value })}
            className="mt-1 w-full rounded-xl border border-zinc-800 bg-black px-3 py-2 text-white"
            placeholder="https://.../sub.vtt"
          />
        </label>
        <label className="text-sm text-zinc-300 md:col-span-2">
          Referer
          <input
            value={form.referer}
            onChange={(event) => setForm({ ...form, referer: event.target.value })}
            className="mt-1 w-full rounded-xl border border-zinc-800 bg-black px-3 py-2 text-white"
          />
        </label>
        <label className="text-sm text-zinc-300 md:col-span-2">
          {t.admin.watchAnimeQualitiesJson}
          <textarea
            value={form.qualities_json}
            onChange={(event) => setForm({ ...form, qualities_json: event.target.value })}
            className="mt-1 min-h-24 w-full rounded-xl border border-zinc-800 bg-black px-3 py-2 text-white"
          />
        </label>
        <button type="submit" className="rounded-xl bg-violet-500 py-3 text-sm font-semibold text-white md:col-span-2">
          {t.admin.watchAnimeAddServer}
        </button>
        {message ? <p className="text-sm text-emerald-400 md:col-span-2">{message}</p> : null}
        {error ? <p className="text-sm text-red-400 md:col-span-2">{error}</p> : null}
      </form>

      <div className="space-y-3">
        {sources.map((source) => (
          <article key={source.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-800 p-4">
            <div>
              <p className="font-semibold text-white">
                MAL {source.mal_id} · {source.content_type} · {source.stream_type}
                {source.episode_number ? ` #${source.episode_number}` : ""}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {source.label} · {source.embed_url}
                {source.subtitle_url ? ` · ${source.subtitle_url}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleDelete(source.id)}
              className="rounded-lg border border-red-900 px-3 py-1.5 text-xs text-red-300"
            >
              {t.admin.watchAnimeDelete}
            </button>
          </article>
        ))}
        {sources.length === 0 ? <p className="text-sm text-zinc-500">{t.admin.watchAnimeEmpty}</p> : null}
      </div>
    </div>
  );
}
