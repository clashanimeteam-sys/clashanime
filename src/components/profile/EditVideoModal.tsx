"use client";

import { FormEvent, useEffect, useState } from "react";
import { HashtagUsageHints } from "@/components/upload/HashtagUsageHints";
import { MentionHashtagTextarea } from "@/components/MentionHashtagTextarea";
import { ModalPortal } from "@/components/ModalPortal";
import { formatHashtags } from "@/lib/upload";
import { useLocale } from "@/providers/LocaleProvider";
import { useScrollLock } from "@/lib/useScrollLock";
import type { Video } from "@/lib/types";

type EditVideoModalProps = {
  video: Video;
  open: boolean;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (values: { title: string; hashtagsText: string }) => void;
};

export function EditVideoModal({
  video,
  open,
  saving,
  error,
  onClose,
  onSubmit,
}: EditVideoModalProps) {
  const { t } = useLocale();
  const [title, setTitle] = useState(video.title);
  const [hashtags, setHashtags] = useState(formatHashtags(video.hashtags ?? []));

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    setTitle(video.title);
    setHashtags(formatHashtags(video.hashtags ?? []));
  }, [open, video]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ title, hashtagsText: hashtags });
  }

  if (!open) return null;

  return (
    <ModalPortal open={open}>
      <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/50 p-4 sm:items-center">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-video-title"
          className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <h2 id="edit-video-title" className="text-lg font-semibold text-black dark:text-white">
              {t.profile.editVideo}
            </h2>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg px-2 py-1 text-sm text-zinc-500 transition hover:bg-zinc-100 hover:text-black dark:hover:bg-zinc-900 dark:hover:text-white"
            >
              {t.auth.close}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-black dark:text-white">
                {t.upload.videoTitle}
              </span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                maxLength={120}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-black dark:text-white"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-black dark:text-white">
                {t.upload.hashtags}
              </span>
              <MentionHashtagTextarea
                value={hashtags}
                onChange={setHashtags}
                mode="hashtags"
                multiline={false}
                placeholder={t.upload.hashtagsPlaceholder}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-black dark:text-white"
              />
              <HashtagUsageHints value={hashtags} />
            </label>

            {error ? (
              <p className="text-sm text-red-500" role="alert">
                {error}
              </p>
            ) : null}

            <div className="flex flex-wrap justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                {t.profile.cancelEdit}
              </button>
              <button
                type="submit"
                disabled={saving || !title.trim()}
                className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black"
              >
                {saving ? t.profile.savingVideo : t.profile.saveVideo}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}
