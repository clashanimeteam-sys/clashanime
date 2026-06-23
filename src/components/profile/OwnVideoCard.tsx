"use client";

import { useState } from "react";
import { EditVideoModal } from "@/components/profile/EditVideoModal";
import { VideoCard } from "@/components/VideoCard";
import { deleteOwnVideo, updateOwnVideo } from "@/lib/ownVideos";
import { createBrowserClient } from "@/lib/supabase/client";
import { useLocale } from "@/providers/LocaleProvider";
import type { Video } from "@/lib/types";

type OwnVideoCardProps = {
  video: Video;
  rank: number;
  onUpdated: (video: Video) => void;
  onDeleted: (videoId: string) => void;
};

export function OwnVideoCard({ video, rank, onUpdated, onDeleted }: OwnVideoCardProps) {
  const { t } = useLocale();
  const supabase = createBrowserClient();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(values: { title: string; hashtagsText: string }) {
    if (!supabase) return;

    setSaving(true);
    setError(null);

    const result = await updateOwnVideo(supabase, video.id, values);

    setSaving(false);

    if (result.error || !result.video) {
      setError(result.error ?? t.profile.videoSaveFailed);
      return;
    }

    onUpdated({
      ...video,
      ...result.video,
      channel: video.channel,
      trending_score: video.trending_score,
    });
    setEditing(false);
  }

  async function handleDelete() {
    if (!supabase || deleting) return;
    if (!window.confirm(t.profile.confirmDeleteVideo)) return;

    setDeleting(true);
    setError(null);

    const result = await deleteOwnVideo(supabase, video.id);

    setDeleting(false);

    if (!result.ok) {
      setError(result.error ?? t.profile.videoDeleteFailed);
      return;
    }

    onDeleted(video.id);
  }

  return (
    <div className="flex flex-col">
      <VideoCard video={video} rank={rank} showModerationStatus />

      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setError(null);
            setEditing(true);
          }}
          disabled={deleting}
          className="flex-1 rounded-full border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          {t.profile.editVideo}
        </button>
        <button
          type="button"
          onClick={() => void handleDelete()}
          disabled={deleting || saving}
          className="flex-1 rounded-full border border-red-300 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
        >
          {deleting ? t.profile.deletingVideo : t.profile.deleteVideo}
        </button>
      </div>

      {error && !editing ? (
        <p className="mt-2 text-xs text-red-500" role="alert">
          {error}
        </p>
      ) : null}

      <EditVideoModal
        video={video}
        open={editing}
        saving={saving}
        error={error}
        onClose={() => {
          if (saving) return;
          setEditing(false);
          setError(null);
        }}
        onSubmit={(values) => void handleSave(values)}
      />
    </div>
  );
}
