"use client";

import Image from "next/image";
import Link from "next/link";
import type { VideoDuelRecord } from "@/lib/videoDuelsServer";
import { useLocale } from "@/providers/LocaleProvider";

type DuelShelfRowProps = {
  title: string;
  duels: VideoDuelRecord[];
  emptyMessage?: string;
};

function DuelThumb({ video, label }: { video: VideoDuelRecord["challengedVideo"]; label: string }) {
  return (
    <div className="relative aspect-[9/16] w-[72px] overflow-hidden rounded-lg bg-black sm:w-[84px]">
      <Image
        src={video.thumbnail_url}
        alt={video.title}
        fill
        className="object-cover"
        sizes="84px"
        unoptimized
      />
      <span className="absolute bottom-1 start-1 rounded bg-black/70 px-1 py-0.5 text-[8px] font-bold text-white">
        {label}
      </span>
    </div>
  );
}

export function DuelShelfRow({ title, duels, emptyMessage }: DuelShelfRowProps) {
  const { t } = useLocale();

  if (duels.length === 0) {
    return emptyMessage ? (
      <section className="mb-10">
        <h2 className="mb-3 px-1 font-display text-lg font-bold text-zinc-900 dark:text-white sm:text-xl">
          {title}
        </h2>
        <p className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400">
          {emptyMessage}
        </p>
      </section>
    ) : null;
  }

  return (
    <section className="mb-10" aria-label={title}>
      <h2 className="mb-3 px-1 font-display text-lg font-bold text-zinc-900 dark:text-white sm:text-xl">
        {title}
      </h2>
      <div className="video-shelf-scroll -mx-1 flex gap-3 overflow-x-auto px-1 pb-2 snap-x snap-mandatory">
        {duels.map((duel) => (
          <Link
            key={duel.id}
            href={`/duel/${duel.id}`}
            className="group w-[220px] shrink-0 snap-start rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 sm:w-[248px]"
          >
            <div className="flex items-center justify-center gap-2">
              <DuelThumb video={duel.challengedVideo} label={t.videosPage.duelDefender} />
              <span className="font-display text-sm font-black text-accent">VS</span>
              <DuelThumb video={duel.challengerVideo} label={t.videosPage.duelChallenger} />
            </div>
            <p className="mt-3 line-clamp-1 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              {duel.challengedVideo.title}
            </p>
            <p className="line-clamp-1 text-[11px] text-zinc-500 dark:text-zinc-400">
              {t.videosPage.duelVersus.replace("{title}", duel.challengerVideo.title)}
            </p>
            <span className="mt-2 inline-flex rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-bold text-accent">
              {t.videosPage.watchDuel}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
