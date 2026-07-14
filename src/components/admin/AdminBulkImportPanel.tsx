"use client";

import Link from "next/link";
import { useState } from "react";
import type { WatchSourceRow } from "@/lib/watchAdmin";
import { useLocale } from "@/providers/LocaleProvider";

const EXAMPLE_JSON = `[
  {
    "episode": 1,
    "video_url": "https://cdn.example.com/ep1.m3u8",
    "subtitle_url": "https://cdn.example.com/sub1.vtt"
  },
  {
    "episode": 2,
    "video_url": "https://cdn.example.com/ep2.m3u8",
    "subtitle_url": "https://cdn.example.com/sub2.vtt"
  }
]`;

/** Fix common paste/RTL corruption: reversed array brackets, leading commas, missing commas between objects. */
function normalizeEpisodesJson(raw: string): string {
  let text = raw.trim().replace(/^\uFEFF/, "");

  // RTL sometimes stores `[` / `]` visually flipped at the edges.
  if (text.startsWith("]") && text.endsWith("[")) {
    text = `[${text.slice(1, -1)}]`;
  }

  // Leading comma after `[`
  text = text.replace(/^\[\s*,/, "[");

  // Missing comma between } and {
  text = text.replace(/}\s*{/g, "},\n{");

  return text;
}

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

    const normalized = normalizeEpisodesJson(episodesJson);
    if (normalized !== episodesJson.trim()) {
      setEpisodesJson(normalized);
    }

    let episodes: unknown;
    try {
      episodes = JSON.parse(normalized);
    } catch (parseError) {
      setError(
        `${t.admin.bulkImportInvalidJson} (${
          parseError instanceof Error ? parseError.message : "parse error"
        })`,
      );
      setSaving(false);
      return;
    }

    if (!Array.isArray(episodes)) {
      setError(t.admin.bulkImportMustBeArray);
      setSaving(false);
      return;
    }

    if (episodes.length === 0) {
      setError(t.admin.bulkImportMustBeArray);
      setSaving(false);
      return;
    }

    try {
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

      let payload: {
        error?: string;
        count?: number;
        inserted?: number;
        updated?: number;
        sources?: WatchSourceRow[];
      } = {};

      try {
        payload = (await response.json()) as typeof payload;
      } catch {
        setError(`${t.admin.bulkImportFailed} (HTTP ${response.status})`);
        setSaving(false);
        return;
      }

      setSaving(false);

      if (!response.ok) {
        setError(payload.error || `${t.admin.bulkImportFailed} (HTTP ${response.status})`);
        return;
      }

      setResultSources(payload.sources ?? []);
      setMessage(
        t.admin.bulkImportSuccess
          .replace("{count}", String(payload.count ?? 0))
          .replace("{inserted}", String(payload.inserted ?? 0))
          .replace("{updated}", String(payload.updated ?? 0)),
      );
    } catch (fetchError) {
      setSaving(false);
      setError(
        fetchError instanceof Error
          ? `${t.admin.bulkImportFailed}: ${fetchError.message}`
          : t.admin.bulkImportFailed,
      );
    }
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
            dir="ltr"
            type="number"
            min={1}
            value={malId}
            onChange={(event) => setMalId(event.target.value)}
            className="mt-1 w-full rounded-xl border border-zinc-800 bg-black px-3 py-2 text-left text-white"
            placeholder="11061"
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

        <div className="md:col-span-2">
          <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm text-zinc-300">{t.admin.bulkImportEpisodesJson}</span>
            <button
              type="button"
              onClick={() => {
                setEpisodesJson(EXAMPLE_JSON);
                setError(null);
                setMessage(null);
              }}
              className="rounded-lg border border-zinc-700 px-3 py-1 text-xs text-zinc-300 hover:border-violet-500 hover:text-white"
            >
              {t.admin.bulkImportResetExample}
            </button>
          </div>
          <textarea
            required
            dir="ltr"
            lang="en"
            value={episodesJson}
            onChange={(event) => setEpisodesJson(event.target.value)}
            spellCheck={false}
            className="min-h-64 w-full rounded-xl border border-zinc-800 bg-black px-3 py-2 text-left font-mono text-sm text-white"
            style={{ unicodeBidi: "isolate" }}
          />
          <span className="mt-1 block text-xs text-zinc-500">{t.admin.bulkImportJsonHint}</span>
        </div>

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
                <p className="mt-1 break-all text-left text-xs text-zinc-500" dir="ltr">
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
