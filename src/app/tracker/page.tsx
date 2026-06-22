import { AnimeTrackerPageContent } from "@/components/AnimeTrackerPageContent";
import {
  getActiveAnimeReleaseClashes,
  getAnimeTrackerToday,
  getAnimeTrackerUpcoming,
} from "@/lib/animeTracker.server";

export const dynamic = "force-dynamic";

export default async function TrackerPage() {
  const [todayReleases, upcomingReleases, activeClashes] = await Promise.all([
    getAnimeTrackerToday(),
    getAnimeTrackerUpcoming(14),
    getActiveAnimeReleaseClashes(),
  ]);

  return (
    <AnimeTrackerPageContent
      todayReleases={todayReleases}
      upcomingReleases={upcomingReleases}
      activeClashes={activeClashes}
    />
  );
}
