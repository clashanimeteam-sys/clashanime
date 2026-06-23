import type { Metadata } from "next";
import { after } from "next/server";
import { AnimeTrackerPageContent } from "@/components/AnimeTrackerPageContent";
import { buildPageMetadata } from "@/lib/seoMetadata";
import { runAnimeTrackerAutoSyncIfStale } from "@/lib/animeTrackerAutoSync";
import {
  releaseToTrackerEntry,
  upcomingToTrackerEntry,
} from "@/lib/animeTracker";
import {
  getActiveAnimeReleaseClashes,
  getAnimeSeoCatalog,
  getAnimeTrackerToday,
  getAnimeTrackerUpcoming,
  getTrendingSpotlightCards,
} from "@/lib/animeTracker.server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export const maxDuration = 120;
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const catalog = await getAnimeSeoCatalog();
  return buildPageMetadata("tracker", { dbAnime: catalog });
}

export default async function TrackerPage() {
  if (createServiceRoleClient()) {
    after(async () => {
      try {
        await runAnimeTrackerAutoSyncIfStale();
      } catch (error) {
        console.error("Anime tracker background sync failed:", error);
      }
    });
  }

  const [todayReleases, upcomingReleases, activeClashes, trendingSpotlight] = await Promise.all([
    getAnimeTrackerToday(),
    getAnimeTrackerUpcoming(14),
    getActiveAnimeReleaseClashes(),
    getTrendingSpotlightCards(),
  ]);

  return (
    <AnimeTrackerPageContent
      todayReleases={todayReleases.map(releaseToTrackerEntry)}
      upcomingReleases={upcomingReleases.map(upcomingToTrackerEntry)}
      activeClashes={activeClashes}
      trendingSpotlight={trendingSpotlight}
    />
  );
}
