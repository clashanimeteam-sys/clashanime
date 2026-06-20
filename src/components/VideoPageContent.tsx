"use client";

import Image from "next/image";
import Link from "next/link";
import { VideoCardActions } from "@/components/VideoCardActions";
import { VideoCardChannel } from "@/components/VideoCardChannel";
import { useLocale } from "@/providers/LocaleProvider";
import type { Video } from "@/lib/types";

type VideoPageContentProps = {
  video: Video;
};

export function VideoPageContent({ video }: VideoPageContentProps) {
  const { t } = useLocale();
  const hasVideo = Boolean(video.video_url?.trim());

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-black dark:border-zinc-800">
        <div className="relative aspect-[9/16] w-full bg-zinc-950">
          {hasVideo ? (
            <video
              src={video.video_url}
              controls
              playsInline
              preload="metadata"
              poster={video.thumbnail_url}
              className="h-full w-full object-contain"
            >
              {t.video.unavailable}
            </video>
          ) : (
            <>
              <Image
                src={video.thumbnail_url}
                alt={video.title}
                fill
                className="object-cover opacity-70"
                unoptimized
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 px-6 text-center">
                <p className="text-sm font-semibold text-white">{t.video.unavailable}</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <h1 className="text-xl font-bold leading-snug text-black sm:text-2xl dark:text-white">
          {video.title}
        </h1>

        {video.channel ? <VideoCardChannel channel={video.channel} /> : null}

        <VideoCardActions
          videoId={video.id}
          title={video.title}
          initialLikes={video.likes_count}
          commentsCount={video.comments_count}
        />

        {video.hashtags && video.hashtags.length > 0 ? (
          <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
            {video.hashtags.map((tag) => `#${tag}`).join(" ")}
          </p>
        ) : null}

        <Link
          href="/"
          className="inline-block text-sm font-semibold text-zinc-600 transition-colors hover:text-accent dark:text-zinc-400"
        >
          {t.video.backHome}
        </Link>
      </div>
    </div>
  );
}
