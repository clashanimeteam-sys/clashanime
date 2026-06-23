import { AnimeTrackerPageContent } from "@/components/AnimeTrackerPageContent";
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
import { syncTrendingSpotlightToDatabase } from "@/lib/animeTrackerTrendingSync";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export const maxDuration = 120;
export const dynamic = "force-dynamic";

async function loadTrendingSpotlight() {
  let trendingSpotlight = await getTrendingSpotlightCards();
  const needsSync = trendingSpotlight.some((card) => !card.clashId || !card.posterUrl);

  if (needsSync && createServiceRoleClient()) {
    try {
      await syncTrendingSpotlightToDatabase();
      trendingSpotlight = await getTrendingSpotlightCards();
    } catch (error) {
      console.error("Trending spotlight auto-sync failed:", error);
    }
  }

  return trendingSpotlight;
}

export default async function TrackerPage() {
  const [todayReleases, upcomingReleases, activeClashes, trendingSpotlight] = await Promise.all([
    getAnimeTrackerToday(),
    getAnimeTrackerUpcoming(14),
    getActiveAnimeReleaseClashes(),
    loadTrendingSpotlight(),
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
