"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { uploadMediaFile } from "@/lib/mediaUpload";
import {
  DEFAULT_WATCH_COMING_SOON_COVER,
  type WatchComingSoonCover,
} from "@/lib/watchComingSoonCover";
import { useLocale } from "@/providers/LocaleProvider";

const COPY = {
  en: {
    title: "Coming Soon cover video",
    hint: "Background video for /watch (Coming Soon). Upload MP4/WebM or paste a URL, then save. Max ~200 MB.",
    videoFile: "Upload video",
    posterFile: "Upload poster image (optional)",
    videoUrl: "Video URL",
    posterUrl: "Poster image URL",
    save: "Save cover",
    saving: "Saving…",
    uploading: "Uploading…",
    reset: "Reset to default",
    preview: "Open /watch",
    saved: "Cover saved. Refresh /watch to see it.",
    resetDone: "Cover reset to default.",
  },
  ar: {
    title: "فيديو غلاف «قريباً»",
    hint: "فيديو خلفية صفحة /watch (قريباً). ارفع MP4/WebM أو الصق رابطاً ثم احفظ. الحد تقريباً 200 ميغابايت.",
    videoFile: "تحميل فيديو",
    posterFile: "تحميل صورة غلاف (اختياري)",
    videoUrl: "رابط الفيديو",
    posterUrl: "رابط صورة الغلاف",
    save: "حفظ الغلاف",
    saving: "جارٍ الحفظ…",
    uploading: "جارٍ الرفع…",
    reset: "إعادة الافتراضي",
    preview: "فتح /watch",
    saved: "تم حفظ الغلاف. حدّث /watch لتشاهده.",
    resetDone: "تمت إعادة الغلاف للافتراضي.",
  },
  ja: {
    title: "Coming Soon カバー動画",
    hint: "/watch（近日公開）の背景動画。MP4/WebMをアップロードするかURLを貼って保存。最大約200MB。",
    videoFile: "動画をアップロード",
    posterFile: "ポスター画像（任意）",
    videoUrl: "動画URL",
    posterUrl: "ポスターURL",
    save: "カバーを保存",
    saving: "保存中…",
    uploading: "アップロード中…",
    reset: "デフォルトに戻す",
    preview: "/watch を開く",
    saved: "保存しました。/watch を更新してください。",
    resetDone: "デフォルトに戻しました。",
  },
} as const;

function extensionForVideo(file: File): string {
  if (file.type === "video/webm" || file.name.toLowerCase().endsWith(".webm")) return "webm";
  if (file.type === "video/quicktime" || file.name.toLowerCase().endsWith(".mov")) return "mov";
  return "mp4";
}

function extensionForImage(file: File): string {
  if (file.type === "image/png" || file.name.toLowerCase().endsWith(".png")) return "png";
  if (file.type === "image/webp" || file.name.toLowerCase().endsWith(".webp")) return "webp";
  return "jpg";
}

export function AdminWatchComingSoonCoverPanel() {
  const { locale } = useLocale();
  const copy = COPY[locale] ?? COPY.en;
  const [cover, setCover] = useState<WatchComingSoonCover>({ ...DEFAULT_WATCH_COMING_SOON_COVER });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"video" | "poster" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/watch-coming-soon-cover", { cache: "no-store" });
      const payload = (await response.json()) as { cover?: WatchComingSoonCover; error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Failed to load");
      setCover(payload.cover ?? { ...DEFAULT_WATCH_COMING_SOON_COVER });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load");
      setCover({ ...DEFAULT_WATCH_COMING_SOON_COVER });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const persist = async (next: WatchComingSoonCover) => {
    const response = await fetch("/api/admin/watch-coming-soon-cover", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    const payload = (await response.json()) as { cover?: WatchComingSoonCover; error?: string };
    if (!response.ok) throw new Error(payload.error ?? "Failed to save");
    setCover(payload.cover ?? next);
    setMessage(copy.saved);
  };

  const uploadVideo = async (file: File) => {
    setUploading("video");
    setMessage(null);
    setError(null);
    try {
      const filename = `watch-cover-${Date.now()}.${extensionForVideo(file)}`;
      const uploaded = await uploadMediaFile({ folder: "clips", filename, file });
      const next = { ...cover, videoUrl: uploaded.publicUrl };
      setCover(next);
      await persist(next);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const uploadPoster = async (file: File) => {
    setUploading("poster");
    setMessage(null);
    setError(null);
    try {
      const filename = `watch-cover-poster-${Date.now()}.${extensionForImage(file)}`;
      const uploaded = await uploadMediaFile({ folder: "banners", filename, file });
      const next = { ...cover, posterUrl: uploaded.publicUrl };
      setCover(next);
      await persist(next);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      await persist(cover);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!window.confirm(copy.reset)) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch("/api/admin/watch-coming-soon-cover", { method: "DELETE" });
      const payload = (await response.json()) as { cover?: WatchComingSoonCover; error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Failed to reset");
      setCover(payload.cover ?? { ...DEFAULT_WATCH_COMING_SOON_COVER });
      setMessage(copy.resetDone);
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : "Failed to reset");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-zinc-400">…</p>;
  }

  return (
    <section className="space-y-4 rounded-2xl border border-orange-500/25 bg-orange-950/20 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-white">{copy.title}</h2>
          <p className="mt-1 text-sm text-zinc-400">{copy.hint}</p>
        </div>
        <Link
          href="/watch"
          target="_blank"
          className="rounded-full border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-200 hover:border-orange-400"
        >
          {copy.preview}
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-zinc-300">
          {copy.videoFile}
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
            disabled={uploading !== null || saving}
            className="mt-1 block w-full text-xs text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-orange-500 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) void uploadVideo(file);
            }}
          />
        </label>
        <label className="text-sm text-zinc-300">
          {copy.posterFile}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            disabled={uploading !== null || saving}
            className="mt-1 block w-full text-xs text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-700 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) void uploadPoster(file);
            }}
          />
        </label>
        <label className="text-sm text-zinc-300 md:col-span-2">
          {copy.videoUrl}
          <input
            type="url"
            value={cover.videoUrl}
            onChange={(event) => setCover((current) => ({ ...current, videoUrl: event.target.value }))}
            className="mt-1 w-full rounded-xl border border-zinc-800 bg-black px-3 py-2 text-white"
          />
        </label>
        <label className="text-sm text-zinc-300 md:col-span-2">
          {copy.posterUrl}
          <input
            type="url"
            value={cover.posterUrl}
            onChange={(event) => setCover((current) => ({ ...current, posterUrl: event.target.value }))}
            className="mt-1 w-full rounded-xl border border-zinc-800 bg-black px-3 py-2 text-white"
          />
        </label>
      </div>

      {cover.videoUrl ? (
        <video
          key={cover.videoUrl}
          className="max-h-48 w-full rounded-xl border border-zinc-800 object-cover"
          src={cover.videoUrl}
          poster={cover.posterUrl || undefined}
          muted
          loop
          playsInline
          controls
          preload="metadata"
        />
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={saving || uploading !== null}
          onClick={() => void save()}
          className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? copy.saving : uploading ? copy.uploading : copy.save}
        </button>
        <button
          type="button"
          disabled={saving || uploading !== null}
          onClick={() => void reset()}
          className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-300 disabled:opacity-50"
        >
          {copy.reset}
        </button>
      </div>

      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </section>
  );
}
