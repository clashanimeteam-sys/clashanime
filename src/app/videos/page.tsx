import type { Metadata } from "next";
import { Suspense } from "react";
import { VideosPageContent } from "@/components/VideosPageContent";
import { getAnimeSeoCatalog, getAnimeTrackerUpcoming, getRecentAnimeReleases } from "@/lib/animeTracker.server";
import { buildPageMetadata } from "@/lib/seoMetadata";
import { getRecentVideoDuels } from "@/lib/videoDuelsServer";
import { getVideosCatalog } from "@/lib/videos";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const catalog = await getAnimeSeoCatalog();
  return buildPageMetadata("videos", { dbAnime: catalog });
}

export default async function VideosPage() {
  const [videos, recentAnimeReleases, upcomingAnimeReleases, recentDuels] = await Promise.all([
    getVideosCatalog(),
    getRecentAnimeReleases(20),
    getAnimeTrackerUpcoming(14),
    getRecentVideoDuels(16),
  ]);

  return (
    <Suspense fallback={null}>
      <VideosPageContent
        videos={videos}
        recentAnimeReleases={recentAnimeReleases}
        upcomingAnimeReleases={upcomingAnimeReleases}
        recentDuels={recentDuels}
      />
    </Suspense>
  );
}
