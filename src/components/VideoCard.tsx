"use client";

import Image from "next/image";
import Link from "next/link";
import { ChallengeClipButton } from "@/components/duel/ChallengeClipButton";
import { ClashThumbnailFire } from "@/components/clash/ClashFireFrame";
import { VideoCardActions } from "@/components/VideoCardActions";
import { VideoCardChannel } from "@/components/VideoCardChannel";
import { useLocale } from "@/providers/LocaleProvider";
import { isInClashTop } from "@/lib/videoRanking";
import type { ModerationStatus, Video } from "@/lib/types";
import { getModerationStatusLabel } from "@/lib/moderation";

type VideoCardProps = {
  video: Video;
  rank?: number;
  showModerationStatus?: boolean;
  showClashBadge?: boolean;
  showTrendingDuelBadge?: boolean;
  compact?: boolean;
  clashMode?: boolean;
};

type MedalTier = "gold" | "silver" | "bronze" | null;

function getMedalTier(rank: number): MedalTier {
  if (rank === 1) return "gold";
  if (rank === 2) return "silver";
  if (rank === 3) return "bronze";
  return null;
}

const medalStyles: Record<
  NonNullable<MedalTier>,
  { badge: string; ring: string }
> = {
  gold: {
    badge:
      "bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 text-amber-950",
    ring: "ring-2 ring-amber-400/60",
  },
  silver: {
    badge:
      "bg-gradient-to-br from-slate-200 via-slate-300 to-slate-500 text-slate-900",
    ring: "ring-2 ring-slate-300/60",
  },
  bronze: {
    badge:
      "bg-gradient-to-br from-orange-300 via-amber-600 to-orange-800 text-orange-950",
    ring: "ring-2 ring-orange-400/50",
  },
};

function RankBadge({ rank, compact = false }: { rank: number; compact?: boolean }) {
  const { t } = useLocale();
  const medal = getMedalTier(rank);

  if (medal) {
    const style = medalStyles[medal];
    const medalLabel =
      medal === "gold"
        ? t.video.goldMedal
        : medal === "silver"
          ? t.video.silverMedal
          : t.video.bronzeMedal;

    return (
      <span
        className={`absolute start-2 top-2 inline-flex items-center gap-0.5 rounded-full font-bold shadow-lg ${compact ? "px-1.5 py-0.5 text-[9px]" : "start-3 top-3 gap-1 px-2.5 py-1 text-xs"} ${style.badge} ${style.ring}`}
        aria-label={`${medalLabel}, ${t.video.rank} ${rank}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={compact ? "h-2.5 w-2.5" : "h-3.5 w-3.5"}
          aria-hidden
        >
          <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.8 7.2 17l.9-5.4L4.2 7.7l5.4-.8L12 2z" />
        </svg>
        #{rank}
      </span>
    );
  }

  return (
    <span
      className={`absolute start-2 top-2 rounded-full bg-brand font-bold text-white shadow ${compact ? "px-1.5 py-0.5 text-[9px]" : "start-3 top-3 px-2.5 py-1 text-xs"}`}
    >
      #{rank}
    </span>
  );
}

export function VideoCard({
  video,
  rank,
  showModerationStatus = false,
  showClashBadge = false,
  showTrendingDuelBadge = false,
  compact = false,
  clashMode = false,
}: VideoCardProps) {
  const { t } = useLocale();
  const moderationStatus = video.moderation_status;
  const showBadge =
    showModerationStatus && moderationStatus && moderationStatus !== "approved";
  const isTopRanked = rank !== undefined && rank <= 3;
  const isClashChampion = clashMode && rank === 1;

  return (
    <article
      className={`group overflow-hidden border bg-white shadow-sm transition-all hover:-translate-y-0.5 dark:border-zinc-800 dark:bg-black ${compact ? "rounded-xl" : "rounded-2xl"} ${
        isClashChampion
          ? "hover:shadow-[0_20px_50px_rgba(249,115,22,0.25)]"
          : "hover:shadow-lg hover:shadow-accent/10"
      } ${
        isTopRanked
          ? "border-accent/25 hover:border-accent/40"
          : clashMode
            ? "border-orange-500/20 hover:border-orange-500/40"
            : "border-zinc-200 hover:border-accent/30 dark:border-zinc-800"
      }`}
    >
      <Link href={`/video/${video.id}`} className="block">
        <div className="relative aspect-[9/16] overflow-hidden bg-muted/20">
          <Image
            src={video.thumbnail_url}
            alt={video.title}
            fill
            sizes={
              compact
                ? "(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12vw"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            }
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span
              className={`flex items-center justify-center rounded-full bg-white/90 text-accent shadow-lg backdrop-blur-sm ${compact ? "h-8 w-8" : "h-12 w-12"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={compact ? "ms-0.5 h-3.5 w-3.5" : "ms-0.5 h-5 w-5"}
                aria-hidden
              >
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            </span>
          </div>

          {rank !== undefined ? <RankBadge rank={rank} compact={compact} /> : null}

          {clashMode && rank !== undefined ? <ClashThumbnailFire rank={rank} /> : null}

          {showClashBadge && isInClashTop(rank) ? (
            <span
              className={`absolute rounded-full bg-gradient-to-r from-orange-600 to-red-600 font-bold text-white shadow-lg ${compact ? "start-2 top-7 px-1.5 py-0.5 text-[8px]" : clashMode ? "start-3 top-12 px-2.5 py-1 text-[10px] shadow-[0_0_12px_rgba(249,115,22,0.6)]" : "start-3 top-12 px-2 py-0.5 text-[10px]"}`}
            >
              {clashMode ? `🔥 ${t.video.inClashTop}` : t.video.inClashTop}
            </span>
          ) : null}

          {showTrendingDuelBadge ? (
            <span className="absolute end-3 top-3 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-1 rounded-full border border-orange-400/40 bg-orange-500/90 px-2 py-1 text-[10px] font-bold text-white shadow-lg backdrop-blur-sm animate-[live-dot_1.4s_ease-in-out_infinite]">
              <span aria-hidden>🔥</span>
              <span className="truncate">{t.video.trendingDuel}</span>
            </span>
          ) : null}

          {showBadge && moderationStatus ? (
            <ModerationBadge status={moderationStatus} />
          ) : null}

          <span
            className={`absolute inline-flex items-center gap-0.5 rounded-full bg-black/75 font-bold text-white backdrop-blur-sm ${compact ? "bottom-2 end-2 px-1.5 py-0.5 text-[8px]" : "bottom-3 end-3 gap-1 px-2 py-1 text-[10px]"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={compact ? "h-2.5 w-2.5" : "h-3 w-3"}
              aria-hidden
            >
              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {(video.views_count ?? 0).toLocaleString()} {compact ? "" : t.video.views}
          </span>
        </div>
      </Link>

      <div className={compact ? "space-y-1.5 p-2" : "space-y-3 p-4"}>
        <Link href={`/video/${video.id}`}>
          <h2
            className={`font-bold leading-snug text-black transition-colors hover:text-accent dark:text-white ${compact ? "line-clamp-1 text-[11px]" : "line-clamp-2 text-sm"}`}
          >
            {video.title}
          </h2>
        </Link>

        <VideoCardActions
          videoId={video.id}
          title={video.title}
          initialLikes={video.likes_count}
          initialComments={video.comments_count}
          initialShares={video.shares_count ?? 0}
          compact={compact}
          preview={{
            thumbnailUrl: video.thumbnail_url,
            videoUrl: video.video_url || undefined,
            videoOwnerId: video.user_id,
            channel: video.channel,
            hashtags: video.hashtags,
          }}
        />

        {(!video.moderation_status || video.moderation_status === "approved") ? (
          <ChallengeClipButton
            challengedVideoId={video.id}
            challengedVideoTitle={video.title}
            challengedVideoOwnerId={video.user_id}
            variant={compact ? "compact" : "card"}
          />
        ) : null}

        {video.channel && !compact ? <VideoCardChannel channel={video.channel} /> : null}
      </div>
    </article>
  );
}

function ModerationBadge({ status }: { status: ModerationStatus }) {
  const { t } = useLocale();
  const label = getModerationStatusLabel(status, t.moderation);

  const styles: Record<ModerationStatus, string> = {
    approved: "bg-emerald-500/90 text-white",
    review: "bg-amber-500/90 text-amber-950",
    pending: "bg-zinc-600/90 text-white",
    rejected: "bg-red-600/90 text-white",
  };

  return (
    <span
      className={`absolute end-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-lg backdrop-blur-sm ${styles[status]}`}
    >
      {label}
    </span>
  );
}
