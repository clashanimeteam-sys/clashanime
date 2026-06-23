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

/** Cache tracker page for 2 minutes; Jikan sync runs via cron/admin only. */
export const revalidate = 120;

export default async function TrackerPage() {
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
