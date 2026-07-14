"use client";

import Link from "next/link";
import { useState } from "react";
import type { WatchSourceRow } from "@/lib/watchAdmin";
import { useLocale } from "@/providers/LocaleProvider";

const EXAMPLE_JSON = `[
  { "episode": 1, "video_url": "https://server.com/ep1.m3u8", "subtitle_url": "https://server.com/sub1.vtt" },
  { "episode": 2, "video_url": "https://server.com/ep2.m3u8", "subtitle_url": "https://server.com/sub2.vtt" }
]`;

export function AdminBulkImportPanel() {
  const { t } = useLocale();
  const [malId, setMalId] = useState("");
  const [label, setLabel] = useState("ClashAnime");
  const [streamType, setStreamType] = useState<"" | "embed" | "hls" | "mp4">("");
  const [episodesJson, setEpisodesJson] = useState(EXAMPLE_JSON);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultSources, setResultSources] = useState<WatchSourceRow[]>([]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setResultSources([]);
    setSaving(true);

    let episodes: unknown;
    try {
      episodes = JSON.parse(episodesJson);
    } catch {
      setError(t.admin.bulkImportInvalidJson);
      setSaving(false);
      return;
    }

    if (!Array.isArray(episodes)) {
      setError(t.admin.bulkImportMustBeArray);
      setSaving(false);
      return;
    }

    const response = await fetch("/api/admin/watch-sources/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mal_id: Number(malId),
        label: label.trim() || "ClashAnime",
        stream_type: streamType || undefined,
        episodes,
      }),
    });

    const payload = (await response.json()) as {
      error?: string;
      count?: number;
      inserted?: number;
      updated?: number;
      sources?: WatchSourceRow[];
    };

    setSaving(false);

    if (!response.ok) {
      setError(payload.error ?? t.admin.bulkImportFailed);
      return;
    }

    setResultSources(payload.sources ?? []);
    setMessage(
      t.admin.bulkImportSuccess
        .replace("{count}", String(payload.count ?? 0))
        .replace("{inserted}", String(payload.inserted ?? 0))
        .replace("{updated}", String(payload.updated ?? 0)),
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.admin.bulkImportTitle}</h1>
        <p className="mt-2 text-sm text-zinc-400">{t.admin.bulkImportSubtitle}</p>
        <p className="mt-2 text-sm">
          <Link href="/admin/watch-anime" className="text-violet-400 hover:underline">
            {t.admin.bulkImportBackToWatch}
          </Link>
        </p>
      </div>

      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 md:grid-cols-2"
      >
        <label className="text-sm text-zinc-300">
          {t.admin.bulkImportMalId}
          <input
            required
            type="number"
            min={1}
            value={malId}
            onChange={(event) => setMalId(event.target.value)}
            className="mt-1 w-full rounded-xl border border-zinc-800 bg-black px-3 py-2 text-white"
            placeholder="e.g. 52991"
          />
          <span className="mt-1 block text-xs text-zinc-500">{t.admin.bulkImportMalHint}</span>
        </label>

        <label className="text-sm text-zinc-300">
          {t.admin.bulkImportLabel}
          <input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            className="mt-1 w-full rounded-xl border border-zinc-800 bg-black px-3 py-2 text-white"
          />
        </label>

        <label className="text-sm text-zinc-300 md:col-span-2">
          {t.admin.bulkImportDefaultStreamType}
          <select
            value={streamType}
            onChange={(event) =>
              setStreamType(event.target.value as "" | "embed" | "hls" | "mp4")
            }
            className="mt-1 w-full rounded-xl border border-zinc-800 bg-black px-3 py-2 text-white"
          >
            <option value="">{t.admin.bulkImportInferStreamType}</option>
            <option value="hls">HLS / m3u8</option>
            <option value="mp4">MP4</option>
            <option value="embed">Embed</option>
          </select>
        </label>

        <label className="text-sm text-zinc-300 md:col-span-2">
          {t.admin.bulkImportEpisodesJson}
          <textarea
            required
            value={episodesJson}
            onChange={(event) => setEpisodesJson(event.target.value)}
            spellCheck={false}
            className="mt-1 min-h-64 w-full rounded-xl border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-white"
          />
          <span className="mt-1 block text-xs text-zinc-500">{t.admin.bulkImportJsonHint}</span>
        </label>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-violet-500 py-3 text-sm font-semibold text-white disabled:opacity-60 md:col-span-2"
        >
          {saving ? t.admin.bulkImportSaving : t.admin.bulkImportSubmit}
        </button>

        {message ? <p className="text-sm text-emerald-400 md:col-span-2">{message}</p> : null}
        {error ? <p className="text-sm text-red-400 md:col-span-2">{error}</p> : null}
      </form>

      {resultSources.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-300">{t.admin.bulkImportResultTitle}</h2>
          {resultSources
            .slice()
            .sort((a, b) => (a.episode_number ?? 0) - (b.episode_number ?? 0))
            .map((source) => (
              <article
                key={source.id}
                className="rounded-2xl border border-zinc-800 p-4"
              >
                <p className="font-semibold text-white">
                  MAL {source.mal_id} · #{source.episode_number} · {source.stream_type}
                </p>
                <p className="mt-1 break-all text-xs text-zinc-500">
                  {source.embed_url}
                  {source.subtitle_url ? ` · ${source.subtitle_url}` : ""}
                </p>
              </article>
            ))}
        </div>
      ) : null}
    </div>
  );
}
