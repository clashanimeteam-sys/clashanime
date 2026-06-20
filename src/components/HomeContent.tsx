"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { SiteTitle } from "@/components/SiteTitle";
import { VideoCard } from "@/components/VideoCard";
import { createBrowserClient } from "@/lib/supabase/client";
import { fetchPublicSiteFlags } from "@/lib/siteSettings";
import { useLocale } from "@/providers/LocaleProvider";
import type { Video } from "@/lib/types";

type HomeContentProps = {
  videos: Video[];
};

export function HomeContent({ videos }: HomeContentProps) {
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    fetchPublicSiteFlags(supabase).then((flags) => setMaintenanceMode(flags.maintenanceMode));
  }, [supabase]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {maintenanceMode ? (
        <div className="mb-6 rounded-2xl border border-amber-300/40 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
          {t.home.maintenanceMode}
        </div>
      ) : null}

      <section className="mb-8">
        <SiteTitle
          primary={t.home.titlePrimary}
          secondary={t.home.titleSecondary}
        />
        <p className="mt-3 max-w-2xl text-sm text-zinc-600 sm:text-base dark:text-zinc-400">
          {t.home.subtitle}
        </p>
      </section>

      <section
        aria-label={t.home.gridLabel}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} rank={video.global_rank} />
        ))}
      </section>
    </div>
  );
}
