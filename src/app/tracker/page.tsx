import { AnimeTrackerPageContent } from "@/components/AnimeTrackerPageContent";
import { syncJikanReleasesToDatabase } from "@/lib/animeTrackerSync";
import { getActiveAnimeReleaseClashes, getTodayClashLinksByMalId } from "@/lib/animeTracker.server";
import { fetchJikanTodaySchedule, fetchJikanUpcomingSchedule } from "@/lib/jikan";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function TrackerPage() {
  const [todayReleases, upcomingReleases, activeClashes] = await Promise.all([
    fetchJikanTodaySchedule(),
    fetchJikanUpcomingSchedule(14),
    getActiveAnimeReleaseClashes(),
  ]);

  try {
    await syncJikanReleasesToDatabase([...todayReleases, ...upcomingReleases]);
  } catch {
    // Page still renders live Jikan data if sync fails.
  }

  const clashLinks = await getTodayClashLinksByMalId();

  return (
    <AnimeTrackerPageContent
      todayReleases={todayReleases.map((release) => ({
        ...release,
        clashId: clashLinks.get(release.malId) ?? null,
      }))}
      upcomingReleases={upcomingReleases}
      activeClashes={activeClashes}
    />
  );
}
