"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VideoCardActions } from "@/components/VideoCardActions";
import { useLocale } from "@/providers/LocaleProvider";
import type { Video } from "@/lib/types";

type RandomDuelContentProps = {
  pair: { left: Video; right: Video } | null;
};

function DuelPanel({ video, side }: { video: Video; side: "left" | "right" }) {
  const { t } = useLocale();

  return (
    <article
      className={`flex flex-1 flex-col overflow-hidden rounded-3xl border bg-zinc-950/80 shadow-xl ${
        side === "left" ? "border-sky-400/30" : "border-accent/30"
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
          <h2 className="line-clamp-2 text-sm font-bold text-white transition-colors hover:text-accent">
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

export function RandomDuelContent({ pair }: RandomDuelContentProps) {
  const { t } = useLocale();
  const router = useRouter();

  if (!pair) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-white">{t.exclusives.randomDuelTitle}</h1>
        <p className="mt-3 text-sm text-zinc-400">{t.exclusives.noDuelVideos}</p>
        <Link href="/exclusives" className="mt-6 inline-flex text-sm font-semibold text-accent hover:underline">
          {t.exclusives.backToExclusives}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            {t.exclusives.randomDuelBadge}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-white">{t.exclusives.randomDuelTitle}</h1>
          <p className="mt-2 text-sm text-zinc-400">{t.exclusives.randomDuelPageDesc}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => router.refresh()}
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-accent hover:text-accent"
          >
            {t.exclusives.shuffleDuel}
          </button>
          <Link
            href="/exclusives"
            className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:text-white"
          >
            {t.exclusives.backToExclusives}
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <DuelPanel video={pair.left} side="left" />
        <div className="flex items-center justify-center py-2 md:py-0">
          <span className="rounded-full border border-white/15 bg-black/60 px-5 py-3 text-lg font-black text-white shadow-lg backdrop-blur-sm">
            {t.exclusives.vs}
          </span>
        </div>
        <DuelPanel video={pair.right} side="right" />
      </div>
    </div>
  );
}
