import { after } from "next/server";
import { AnimeTrackerPageContent } from "@/components/AnimeTrackerPageContent";
import { runAnimeTrackerAutoSyncIfStale } from "@/lib/animeTrackerAutoSync";
import {
  releaseToTrackerEntry,
  upcomingToTrackerEntry,
} from "@/lib/animeTracker";
import {
  getActiveAnimeReleaseClashes,
  getAnimeTrackerToday,
  getAnimeTrackerUpcoming,
  getTrendingSpotlightCards,
} from "@/lib/animeTracker.server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export const maxDuration = 120;
export const dynamic = "force-dynamic";

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
