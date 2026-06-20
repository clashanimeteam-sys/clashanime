"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { VideoCardActions } from "@/components/VideoCardActions";
import { VideoCardChannel } from "@/components/VideoCardChannel";
import { useLocale } from "@/providers/LocaleProvider";
import type { Video } from "@/lib/types";

type VideoPageContentProps = {
  video: Video;
};

export function VideoPageContent({ video }: VideoPageContentProps) {
  const { t } = useLocale();
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasVideo = Boolean(video.video_url?.trim());

  useEffect(() => {
    const element = videoRef.current;
    if (!element || !hasVideo) return;

    const startPlayback = async () => {
      try {
        await element.play();
      } catch {
        element.muted = true;
        try {
          await element.play();
        } catch {
          // Browser blocked autoplay; controls remain available.
        }
      }
    };

    if (element.readyState >= 2) {
      void startPlayback();
      return;
    }

    element.addEventListener("loadeddata", startPlayback, { once: true });
    return () => element.removeEventListener("loadeddata", startPlayback);
  }, [hasVideo, video.video_url]);

  return (
    <div className="relative h-[calc(100dvh-3.5rem)] w-full bg-black">
      {hasVideo ? (
        <video
          ref={videoRef}
          src={video.video_url}
          autoPlay
          controls
          playsInline
          preload="auto"
          poster={video.thumbnail_url}
          className="absolute inset-0 h-full w-full object-contain"
        >
          {t.video.unavailable}
        </video>
      ) : (
        <>
          <Image
            src={video.thumbnail_url}
            alt={video.title}
            fill
            className="object-contain opacity-70"
            unoptimized
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 px-6 text-center">
            <p className="text-sm font-semibold text-white">{t.video.unavailable}</p>
          </div>
        </>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent px-4 pb-5 pt-16 sm:px-6">
        <div className="pointer-events-auto space-y-3">
          <h1 className="text-lg font-bold leading-snug text-white sm:text-xl">{video.title}</h1>

          {video.channel ? (
            <div className="[&_a]:hover:bg-white/10 [&_span]:text-zinc-200">
              <VideoCardChannel channel={video.channel} />
            </div>
          ) : null}

          <VideoCardActions
            videoId={video.id}
            title={video.title}
            initialLikes={video.likes_count}
            commentsCount={video.comments_count}
          />

          {video.hashtags && video.hashtags.length > 0 ? (
            <p className="text-sm font-semibold text-zinc-300">
              {video.hashtags.map((tag) => `#${tag}`).join(" ")}
            </p>
          ) : null}

          <Link
            href="/"
            className="inline-block text-sm font-semibold text-zinc-300 transition-colors hover:text-white"
          >
            {t.video.backHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
