"use client";

import Image from "next/image";
import Link from "next/link";
import { VideoCardActions } from "@/components/VideoCardActions";
import { useLocale } from "@/providers/LocaleProvider";
import type { Video } from "@/lib/types";
import type { ReactNode } from "react";

type DuelArenaContentProps = {
  left: Video;
  right: Video;
  badge: string;
  title: string;
  description: string;
  actions?: ReactNode;
  backHref?: string;
  backLabel?: string;
};

function DuelPanel({ video, side }: { video: Video; side: "left" | "right" }) {
  const { t } = useLocale();

  return (
    <article
      className={`flex flex-1 flex-col overflow-hidden rounded-3xl border bg-white shadow-xl dark:bg-zinc-950/80 ${
        side === "left" ? "border-sky-400/40 dark:border-sky-400/30" : "border-accent/40 dark:border-accent/30"
      }`}
    >
      <Link href={`/video/${video.id}`} className="group relative block aspect-[9/16] overflow-hidden bg-black">
        <Image
          src={video.thumbnail_url}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <span className="absolute bottom-3 start-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
          {t.exclusives.watchAndVote}
        </span>
      </Link>

      <div className="space-y-3 p-4">
        <Link href={`/video/${video.id}`}>
          <h2 className="line-clamp-2 text-sm font-bold text-zinc-900 transition-colors hover:text-accent dark:text-white">
            {video.title}
          </h2>
        </Link>
        <VideoCardActions
          videoId={video.id}
          title={video.title}
          initialLikes={video.likes_count}
          initialComments={video.comments_count}
          initialShares={video.shares_count ?? 0}
          preview={{
            thumbnailUrl: video.thumbnail_url,
            videoUrl: video.video_url || undefined,
            videoOwnerId: video.user_id,
            channel: video.channel,
            hashtags: video.hashtags,
          }}
        />
      </div>
    </article>
  );
}

export function DuelArenaContent({
  left,
  right,
  badge,
  title,
  description,
  actions,
  backHref = "/exclusives",
  backLabel,
}: DuelArenaContentProps) {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-accent">{badge}</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            {title}
          </h1>
          <p className="mt-2 text-base font-medium leading-relaxed text-zinc-700 dark:text-zinc-300">
            {description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {actions}
          <Link
            href={backHref}
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-white"
          >
            {backLabel ?? t.exclusives.backToExclusives}
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <DuelPanel video={left} side="left" />
        <div className="flex items-center justify-center py-2 md:py-0">
          <span className="rounded-full border border-zinc-300 bg-white px-5 py-3 text-lg font-black text-zinc-900 shadow-lg dark:border-white/15 dark:bg-black/60 dark:text-white">
            {t.exclusives.vs}
          </span>
        </div>
        <DuelPanel video={right} side="right" />
      </div>
    </div>
  );
}
