"use client";

import Image from "next/image";
import Link from "next/link";
import { VideoCardActions } from "@/components/VideoCardActions";
import { useLocale } from "@/providers/LocaleProvider";
import type { Video } from "@/lib/types";

type VideoCardProps = {
  video: Video;
  rank: number;
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

function RankBadge({ rank }: { rank: number }) {
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
        className={`absolute start-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold shadow-lg ${style.badge} ${style.ring}`}
        aria-label={`${medalLabel}, ${t.video.rank} ${rank}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-3.5 w-3.5"
          aria-hidden
        >
          <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.8 7.2 17l.9-5.4L4.2 7.7l5.4-.8L12 2z" />
        </svg>
        #{rank}
      </span>
    );
  }

  return (
    <span className="absolute start-3 top-3 rounded-full bg-brand px-2.5 py-1 text-xs font-bold text-white shadow">
      #{rank}
    </span>
  );
}

export function VideoCard({ video, rank }: VideoCardProps) {
  return (
    <article
      className={`group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/10 dark:border-zinc-800 dark:bg-black ${
        rank <= 3
          ? "border-accent/25 hover:border-accent/40"
          : "border-zinc-200 hover:border-accent/30 dark:border-zinc-800"
      }`}
    >
      <Link href={`/video/${video.id}`} className="block">
        <div className="relative aspect-[9/16] overflow-hidden bg-muted/20">
          <Image
            src={video.thumbnail_url}
            alt={video.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-accent shadow-lg backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="ms-0.5 h-5 w-5"
                aria-hidden
              >
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            </span>
          </div>

          <RankBadge rank={rank} />
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <Link href={`/video/${video.id}`}>
          <h2 className="line-clamp-2 text-sm font-semibold leading-snug text-black transition-colors hover:text-accent dark:text-white">
            {video.title}
          </h2>
        </Link>

        <VideoCardActions
          videoId={video.id}
          title={video.title}
          initialLikes={video.likes_count}
          commentsCount={video.comments_count}
        />
      </div>
    </article>
  );
}
