"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { getSupabaseConfig } from "@/lib/supabase/config";
import {
  getPublicStorageUrl,
  getVideoDuration,
  parseHashtags,
} from "@/lib/upload";
import { MAX_CLIP_SECONDS, MIN_CLIP_SECONDS } from "@/lib/types";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

export function UploadVideoForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const config = useMemo(() => getSupabaseConfig(), []);

  const [title, setTitle] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleVideoChange(file: File | undefined) {
    if (!file) return;

    setError(null);

    try {
      const seconds = await getVideoDuration(file);
      if (seconds < MIN_CLIP_SECONDS || seconds > MAX_CLIP_SECONDS) {
        setVideoFile(null);
        setDuration(null);
        setError(t.upload.durationError);
        return;
      }

      setVideoFile(file);
      setDuration(Math.round(seconds));
    } catch {
      setVideoFile(null);
      setDuration(null);
      setError(t.upload.invalidVideo);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !user || !config) {
      setError(t.auth.configError);
      return;
    }

    if (!videoFile || !thumbnailFile || !title.trim()) {
      setError(t.upload.requiredFields);
      return;
    }

    if (!duration || duration < MIN_CLIP_SECONDS || duration > MAX_CLIP_SECONDS) {
      setError(t.upload.durationError);
      return;
    }

    setLoading(true);
    setError(null);

    const clipId = crypto.randomUUID();
    const videoPath = `${user.id}/${clipId}.mp4`;
    const thumbPath = `${user.id}/${clipId}.jpg`;

    const { error: videoUploadError } = await supabase.storage
      .from("clips")
      .upload(videoPath, videoFile, {
        upsert: false,
        contentType: videoFile.type || "video/mp4",
      });

    if (videoUploadError) {
      setError(videoUploadError.message);
      setLoading(false);
      return;
    }

    const { error: thumbUploadError } = await supabase.storage
      .from("thumbnails")
      .upload(thumbPath, thumbnailFile, {
        upsert: false,
        contentType: thumbnailFile.type || "image/jpeg",
      });

    if (thumbUploadError) {
      setError(thumbUploadError.message);
      setLoading(false);
      return;
    }

    const videoUrl = getPublicStorageUrl(config.url, "clips", videoPath);
    const thumbnailUrl = getPublicStorageUrl(config.url, "thumbnails", thumbPath);
    const tags = parseHashtags(hashtags);

    const { error: insertError } = await supabase.from("videos").insert({
      title: title.trim(),
      thumbnail_url: thumbnailUrl,
      video_url: videoUrl,
      user_id: user.id,
      hashtags: tags,
      duration_seconds: duration,
      description: tags.length ? tags.map((tag) => `#${tag}`).join(" ") : "",
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push("/profile");
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white">{t.upload.title}</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t.upload.subtitle}</p>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-black dark:text-white">
          {t.upload.videoFile}
        </span>
        <input
          type="file"
          accept="video/*"
          required
          onChange={(event) => handleVideoChange(event.target.files?.[0])}
          className="block w-full text-sm text-zinc-600 file:mr-4 file:rounded-lg file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white dark:text-zinc-400 dark:file:bg-white dark:file:text-black"
        />
        {duration !== null && (
          <p className="mt-1 text-xs text-zinc-500">
            {t.upload.durationLabel}: {duration}s
          </p>
        )}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-black dark:text-white">
          {t.upload.thumbnailFile}
        </span>
        <input
          type="file"
          accept="image/*"
          required
          onChange={(event) => setThumbnailFile(event.target.files?.[0] ?? null)}
          className="block w-full text-sm text-zinc-600 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-black dark:text-zinc-400 dark:file:bg-zinc-900 dark:file:text-white"
        />
        {thumbnailFile && (
          <div className="relative mt-3 h-40 w-28 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
            <Image
              src={URL.createObjectURL(thumbnailFile)}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-black dark:text-white">
          {t.upload.videoTitle}
        </span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          maxLength={120}
          placeholder={t.upload.videoTitlePlaceholder}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-black dark:text-white"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-black dark:text-white">
          {t.upload.hashtags}
        </span>
        <input
          value={hashtags}
          onChange={(event) => setHashtags(event.target.value)}
          placeholder={t.upload.hashtagsPlaceholder}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-black dark:text-white"
        />
      </label>

      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black"
      >
        {loading ? t.upload.uploading : t.upload.publish}
      </button>
    </form>
  );
}
