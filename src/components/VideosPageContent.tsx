"use client";

import { VideoGridContent } from "@/components/VideoGridContent";
import { useLocale } from "@/providers/LocaleProvider";
import type { Video } from "@/lib/types";

export function VideosPageContent({ videos }: { videos: Video[] }) {
  const { t } = useLocale();

  return (
    <VideoGridContent
      title={t.pages.videosTitle}
      subtitle={t.pages.videosSubtitle}
      videos={videos}
      emptyMessage={t.pages.emptyVideos}
    />
  );
}
