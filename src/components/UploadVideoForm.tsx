"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { computeContentFingerprints } from "@/lib/contentFingerprint";
import { analyzeContentAuthenticity } from "@/lib/contentHeuristics";
import {
  getScanRejectionMessage,
  type ScanUploadResult,
} from "@/lib/moderation";
import { deleteMediaObjects } from "@/lib/mediaUpload";
import { createBrowserClient } from "@/lib/supabase/client";
import { getSupabaseConfig } from "@/lib/supabase/config";
import {
  getPublicStorageUrl,
  getVideoDuration,
  parseHashtags,
  uploadToStorageWithFallback,
} from "@/lib/upload";
import { canUploadVideos } from "@/lib/points";
import { fetchPublicSiteFlags } from "@/lib/siteSettings";
import { MAX_CLIP_SECONDS, MIN_CLIP_SECONDS } from "@/lib/types";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

export function UploadVideoForm() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const config = useMemo(() => getSupabaseConfig(), []);

  const [title, setTitle] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadsAllowed, setUploadsAllowed] = useState(true);

  useEffect(() => {
    if (!supabase) return;
    fetchPublicSiteFlags(supabase).then((flags) => setUploadsAllowed(flags.allowUploads));
  }, [supabase]);

  async function handleVideoChange(file: File | undefined) {
    if (!file) return;

    setError(null);
    setSuccessMessage(null);

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

    if (profile?.is_banned) {
      setError(t.upload.accountBanned);
      return;
    }

    if (!canUploadVideos(profile)) {
      setError(t.upload.levelRequired);
      return;
    }

    if (!uploadsAllowed) {
      setError(t.upload.uploadsDisabled);
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
    setScanning(true);
    setError(null);
    setSuccessMessage(null);

    let fingerprints;
    let suspicion;

    try {
      [fingerprints, suspicion] = await Promise.all([
        computeContentFingerprints(videoFile, thumbnailFile),
        analyzeContentAuthenticity(videoFile),
      ]);
    } catch {
      setLoading(false);
      setScanning(false);
      setError(t.upload.scanFailed);
      return;
    }

    const { data: scanData, error: scanError } = await supabase.rpc("scan_upload_content", {
      p_file_hash: fingerprints.fileHash,
      p_perceptual_hash: fingerprints.perceptualHash,
      p_thumb_hash: fingerprints.thumbHash,
      p_user_id: user.id,
      p_suspicion_score: suspicion.score,
      p_suspicion_flags: suspicion.flags,
    });

    setScanning(false);

    if (scanError) {
      setLoading(false);
      setError(scanError.message);
      return;
    }

    const scan = scanData as ScanUploadResult;

    if (scan.status === "rejected") {
      setLoading(false);
      setError(getScanRejectionMessage(scan.reason, t.moderation));
      return;
    }

    const clipId = crypto.randomUUID();
    const videoPath = `${user.id}/${clipId}.mp4`;
    const thumbPath = `${user.id}/${clipId}.jpg`;
    let videoObjectKey: string | null = null;
    let thumbObjectKey: string | null = null;

    let videoUrl: string;
    try {
      const videoUpload = await uploadToStorageWithFallback({
        supabase,
        config,
        folder: "clips",
        bucket: "clips",
        storagePath: videoPath,
        filename: `${clipId}.mp4`,
        file: videoFile,
      });
      videoUrl = videoUpload.publicUrl;
      videoObjectKey = videoUpload.objectKey;
    } catch (uploadError) {
      setError(resolveUploadError(uploadError, t.upload));
      setLoading(false);
      return;
    }

    let thumbnailUrl: string;
    try {
      const thumbUpload = await uploadToStorageWithFallback({
        supabase,
        config,
        folder: "thumbnails",
        bucket: "thumbnails",
        storagePath: thumbPath,
        filename: `${clipId}.jpg`,
        file: thumbnailFile,
      });
      thumbnailUrl = thumbUpload.publicUrl;
      thumbObjectKey = thumbUpload.objectKey;
    } catch (uploadError) {
      if (videoObjectKey) {
        await removeUploadedMedia(supabase, "clips", videoPath, videoObjectKey);
      }
      setError(resolveUploadError(uploadError, t.upload));
      setLoading(false);
      return;
    }

    const tags = parseHashtags(hashtags);

    const { error: insertError } = await supabase.from("videos").insert({
      title: title.trim(),
      thumbnail_url: thumbnailUrl,
      video_url: videoUrl,
      user_id: user.id,
      hashtags: tags,
      duration_seconds: duration,
      description: tags.length ? tags.map((tag) => `#${tag}`).join(" ") : "",
      moderation_status: scan.status,
      file_hash: fingerprints.fileHash,
      perceptual_hash: fingerprints.perceptualHash,
      thumb_hash: fingerprints.thumbHash,
      scanned_at: new Date().toISOString(),
      suspicion_score: suspicion.score,
      suspicion_flags: suspicion.flags,
    });

    setLoading(false);

    if (insertError) {
      await removeUploadedMedia(supabase, "clips", videoPath, videoObjectKey);
      await removeUploadedMedia(supabase, "thumbnails", thumbPath, thumbObjectKey);
      setError(insertError.message);
      return;
    }

    if (scan.status === "review" || scan.status === "pending") {
      setSuccessMessage(t.upload.reviewPending);
      window.setTimeout(() => router.push("/profile"), 1800);
      return;
    }

    router.push("/profile");
  }

  async function removeUploadedMedia(
    client: NonNullable<ReturnType<typeof createBrowserClient>>,
    bucket: "clips" | "thumbnails",
    storagePath: string,
    objectKey: string | null,
  ) {
    if (objectKey) {
      await deleteMediaObjects([objectKey]).catch(() => undefined);
      return;
    }

    await client.storage.from(bucket).remove([storagePath]);
  }

  function resolveUploadError(
    error: unknown,
    messages: { uploadFailed: string; r2UploadBlocked: string },
  ) {
    if (!(error instanceof Error)) return messages.uploadFailed;
    if (error.message.includes("r2 direct upload blocked") || error.message.includes("r2 worker upload blocked")) {
      return messages.r2UploadBlocked;
    }
    if (error.message.includes("r2 upload forbidden") || error.message.includes("check CORS")) {
      return messages.r2UploadBlocked;
    }
    if (error.message === "Failed to fetch") {
      return messages.uploadFailed;
    }
    if (error.message.includes("EPROTO") || error.message.includes("SSL") || error.message.includes("handshake")) {
      return messages.r2UploadBlocked;
    }
    return error.message || messages.uploadFailed;
  }

  const busy = loading || scanning;
  const uploadUnlocked = canUploadVideos(profile);

  if (profile && !uploadUnlocked) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold text-black dark:text-white">{t.upload.title}</h1>
        <p className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          {t.upload.levelRequired}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white">{t.upload.title}</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t.upload.subtitle}</p>
        <p className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          {t.upload.originalOnly}
        </p>
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

      {successMessage && (
        <p className="text-sm text-emerald-600 dark:text-emerald-400" role="status">
          {successMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black"
      >
        {scanning ? t.upload.scanning : loading ? t.upload.uploading : t.upload.publish}
      </button>
    </form>
  );
}
