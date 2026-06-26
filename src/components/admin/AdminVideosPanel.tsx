"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminVideoOwnerEvents } from "@/components/admin/AdminVideoOwnerEvents";
import { getModerationStatusLabel } from "@/lib/moderation";
import { logModerationAction, moderationActionFromStatus } from "@/lib/moderationLog";
import { notifyAdminReviewCountsChanged } from "@/lib/adminReviewCounts";
import { isInClashTop } from "@/lib/videoRanking";
import { createBrowserClient } from "@/lib/supabase/client";
import type { ModerationStatus, Video } from "@/lib/types";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

type AdminVideo = Video & {
  owner_username?: string | null;
};

type VideoFilter = ModerationStatus | "all" | "awaiting_review";

const STATUS_FILTERS: VideoFilter[] = [
  "all",
  "awaiting_review",
  "review",
  "pending",
  "approved",
  "rejected",
];

function isVideoFilter(value: string): value is VideoFilter {
  return STATUS_FILTERS.includes(value as VideoFilter);
}

export function AdminVideosPanel({ initialStatus = "all" }: { initialStatus?: string }) {
  const { user } = useAuth();
  const { t, formatNumber, formatDateTime } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [statusFilter, setStatusFilter] = useState<VideoFilter>(
    isVideoFilter(initialStatus) ? initialStatus : "all",
  );
  const [loading, setLoading] = useState(true);
  const [globalRanks, setGlobalRanks] = useState<Record<string, number>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadVideos = useCallback(async () => {
    if (!supabase) return;

    setLoading(true);
    setError(null);

    let query = supabase
      .from("videos")
      .select(
        "id, title, thumbnail_url, video_url, likes_count, comments_count, views_count, shares_count, created_at, user_id, moderation_status, admin_review_pending, rejection_reason, suspicion_score, suspicion_flags",
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (statusFilter === "awaiting_review") {
      query = query.eq("admin_review_pending", true);
    } else if (statusFilter !== "all") {
      query = query.eq("moderation_status", statusFilter);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    const rows = data ?? [];
    const userIds = [...new Set(rows.map((row) => row.user_id).filter(Boolean))] as string[];

    let profileMap = new Map<string, string>();
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", userIds);
      profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile.username]));
    }

    setVideos(
      rows.map((row) => ({
        ...row,
        trending_score: 0,
        owner_username: row.user_id ? (profileMap.get(row.user_id) ?? null) : null,
      })),
    );

    try {
      const response = await fetch("/api/videos/global-ranks", { cache: "no-store" });
      if (response.ok) {
        setGlobalRanks((await response.json()) as Record<string, number>);
      }
    } catch {
      setGlobalRanks({});
    }

    setLoading(false);
  }, [supabase, statusFilter]);

  const refreshGlobalRanks = useCallback(async () => {
    try {
      const response = await fetch("/api/videos/global-ranks", { cache: "no-store" });
      if (response.ok) {
        setGlobalRanks((await response.json()) as Record<string, number>);
      }
    } catch {
      setGlobalRanks({});
    }
  }, []);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  useEffect(() => {
    if (!supabase) return;

    let rankTimer: number | null = null;
    const scheduleRankRefresh = () => {
      if (rankTimer !== null) window.clearTimeout(rankTimer);
      rankTimer = window.setTimeout(() => {
        rankTimer = null;
        void refreshGlobalRanks();
      }, 300);
    };

    const channel = supabase
      .channel("admin-videos-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "videos" },
        (payload) => {
          if (payload.eventType === "DELETE") {
            const row = payload.old as { id?: string };
            if (row.id) {
              setVideos((current) => current.filter((video) => video.id !== row.id));
            }
            scheduleRankRefresh();
            return;
          }

          const row = payload.new as AdminVideo;
          if (!row.id) return;

          setVideos((current) => {
            const index = current.findIndex((video) => video.id === row.id);
            if (index === -1) {
              void loadVideos();
              return current;
            }
            const next = [...current];
            next[index] = { ...next[index], ...row };
            return next;
          });
          scheduleRankRefresh();
        },
      )
      .subscribe();

    return () => {
      if (rankTimer !== null) window.clearTimeout(rankTimer);
      void supabase.removeChannel(channel);
    };
  }, [supabase, loadVideos, refreshGlobalRanks]);

  async function markVideoReviewed(videoId: string) {
    if (!supabase || !user) return;

    setMessage(null);
    setError(null);

    const { error: updateError } = await supabase
      .from("videos")
      .update({ admin_review_pending: false })
      .eq("id", videoId);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setMessage(t.admin.saved);
    notifyAdminReviewCountsChanged();
    await loadVideos();
  }

  async function moderateVideo(
    videoId: string,
    moderationStatus: ModerationStatus,
    rejectionReason?: string,
  ) {
    if (!supabase || !user) return;

    setMessage(null);
    setError(null);

    const previousStatus = videos.find((video) => video.id === videoId)?.moderation_status ?? null;

    const updatePayload: {
      moderation_status: ModerationStatus;
      rejection_reason: string | null;
      admin_review_pending?: boolean;
    } = {
      moderation_status: moderationStatus,
      rejection_reason: rejectionReason ?? null,
    };

    if (moderationStatus === "approved") {
      updatePayload.admin_review_pending = false;
    }

    const { error: updateError } = await supabase
      .from("videos")
      .update(updatePayload)
      .eq("id", videoId);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await logModerationAction(supabase, {
      videoId,
      staffId: user.id,
      action: moderationActionFromStatus(moderationStatus),
      previousStatus,
      newStatus: moderationStatus,
      notes: rejectionReason ?? null,
    });

    setMessage(t.admin.saved);
    notifyAdminReviewCountsChanged();
    await loadVideos();
  }

  async function deleteVideo(videoId: string) {
    if (!supabase || !user) return;
    if (!window.confirm(t.admin.confirmDeleteVideo)) return;

    setMessage(null);
    setError(null);

    const video = videos.find((entry) => entry.id === videoId);

    const { error: deleteError } = await supabase.from("videos").delete().eq("id", videoId);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    await logModerationAction(supabase, {
      videoId,
      staffId: user.id,
      action: "delete",
      previousStatus: video?.moderation_status ?? null,
      newStatus: null,
      notes: video?.title ?? null,
    });

    setMessage(t.admin.deleted);
    await loadVideos();
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.admin.videosTitle}</h1>
        <p className="mt-2 text-sm text-zinc-400">{t.admin.videosSubtitle}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              statusFilter === status
                ? "bg-accent text-white"
                : "border border-zinc-700 text-zinc-300 hover:border-zinc-500"
            }`}
          >
            {status === "all"
              ? t.admin.allStatuses
              : status === "awaiting_review"
                ? t.admin.awaitingAdminReview
                : getModerationStatusLabel(status, t.moderation)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-zinc-400">{t.admin.loading}</p>
      ) : (
        <div className="space-y-4">
          {videos.map((video) => (
            <article
              key={video.id}
              className="grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 lg:grid-cols-[120px_1fr_auto]"
            >
              <div className="relative h-36 w-24 overflow-hidden rounded-lg bg-zinc-800">
                <Image
                  src={video.thumbnail_url}
                  alt={video.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-semibold text-white">{video.title}</h2>
                  <span className="rounded-full bg-zinc-800 px-2 py-1 text-[10px] font-semibold uppercase text-zinc-300">
                    {video.moderation_status
                      ? getModerationStatusLabel(video.moderation_status, t.moderation)
                      : t.moderation.statusPending}
                  </span>
                  {video.admin_review_pending ? (
                    <span className="rounded-full bg-amber-500/20 px-2 py-1 text-[10px] font-semibold uppercase text-amber-200">
                      {t.admin.awaitingAdminReview}
                    </span>
                  ) : null}
                </div>
                <p className="text-sm text-zinc-400">
                  @{video.owner_username ?? "unknown"} · {formatDateTime(video.created_at)}
                </p>
                <p className="text-xs text-zinc-500">
                  {t.admin.table.views}: {formatNumber(video.views_count ?? 0)} ·{" "}
                  {formatNumber(video.likes_count)} · {formatNumber(video.comments_count)}
                </p>
                {video.moderation_status === "approved" && globalRanks[video.id] ? (
                  <p className="text-xs text-accent">
                    {t.admin.clashRank}: #{globalRanks[video.id]}
                    {isInClashTop(globalRanks[video.id]) ? ` · ${t.admin.inClashTop}` : ""}
                  </p>
                ) : null}
                {(video.suspicion_score ?? 0) > 0 && (
                  <p className="text-xs text-amber-300">
                    {t.admin.suspicionScore}: {video.suspicion_score} ·{" "}
                    {(video.suspicion_flags ?? []).join(", ") || "—"}
                  </p>
                )}
                {video.rejection_reason ? (
                  <p className="text-xs text-red-300">
                    {t.admin.rejectionReason}: {video.rejection_reason}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2 lg:flex-col lg:items-stretch">
                {video.admin_review_pending ? (
                  <button
                    type="button"
                    onClick={() => markVideoReviewed(video.id)}
                    className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-black hover:bg-amber-400"
                  >
                    {t.admin.markReviewed}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => moderateVideo(video.id, "approved")}
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
                >
                  {t.admin.approve}
                </button>
                <button
                  type="button"
                  onClick={() => moderateVideo(video.id, "rejected", "admin_rejected")}
                  className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-500"
                >
                  {t.admin.reject}
                </button>
                <button
                  type="button"
                  onClick={() => moderateVideo(video.id, "review")}
                  className="rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200 hover:border-zinc-500"
                >
                  {t.admin.sendToReview}
                </button>
                <Link
                  href={`/video/${video.id}`}
                  className="rounded-lg border border-zinc-700 px-3 py-2 text-center text-xs font-semibold text-zinc-200 hover:border-zinc-500"
                >
                  {t.admin.preview}
                </Link>
                {video.video_url ? (
                  <a
                    href={video.video_url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-zinc-700 px-3 py-2 text-center text-xs font-semibold text-zinc-200 hover:border-zinc-500"
                  >
                    {t.admin.downloadVideo}
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={() => deleteVideo(video.id)}
                  className="rounded-lg border border-red-900 px-3 py-2 text-xs font-semibold text-red-300 hover:border-red-700"
                >
                  {t.admin.delete}
                </button>
              </div>
            </article>
          ))}

          {videos.length === 0 && (
            <p className="rounded-2xl border border-zinc-800 p-6 text-sm text-zinc-400">
              {t.admin.noVideos}
            </p>
          )}
        </div>
      )}

      {message && <p className="text-sm text-emerald-400">{message}</p>}
      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <AdminVideoOwnerEvents />
    </div>
  );
}
