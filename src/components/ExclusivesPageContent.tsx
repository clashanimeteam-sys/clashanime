"use client";

import { VideoGridContent } from "@/components/VideoGridContent";
import { useLocale } from "@/providers/LocaleProvider";
import type { Video } from "@/lib/types";

export function ExclusivesPageContent({ videos }: { videos: Video[] }) {
  const { t } = useLocale();

  return (
    <VideoGridContent
      title={t.pages.exclusivesTitle}
      subtitle={t.pages.exclusivesSubtitle}
      videos={videos}
      emptyMessage={t.pages.emptyExclusives}
    />
  );
}
