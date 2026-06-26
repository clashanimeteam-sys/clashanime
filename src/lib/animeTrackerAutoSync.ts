import { syncJikanReleasesToDatabase } from "@/lib/animeTrackerSync";
import { syncTrendingSpotlightToDatabase } from "@/lib/animeTrackerTrendingSync";
import { createServiceRoleClient } from "@/lib/supabase/admin";

/** Refresh tracker data at most once per hour unless forced. */
export const ANIME_TRACKER_SYNC_STALE_MS = 60 * 60 * 1000;

export type AnimeTrackerFullSyncResult = {
  schedule: Awaited<ReturnType<typeof syncJikanReleasesToDatabase>>;
  trending: Awaited<ReturnType<typeof syncTrendingSpotlightToDatabase>>;
  syncedAt: string;
};

export async function getAnimeTrackerLastSyncedAt(): Promise<string | null> {
  const serviceRole = createServiceRoleClient();
  if (!serviceRole) return null;

  const { data, error } = await serviceRole.rpc("get_anime_tracker_sync_meta");
  if (error || !data?.[0]?.last_synced_at) return null;
  return String(data[0].last_synced_at);
}

export function isAnimeTrackerSyncStale(lastSyncedAt: string | null, now = Date.now()): boolean {
  if (!lastSyncedAt) return true;
  const syncedMs = new Date(lastSyncedAt).getTime();
  if (Number.isNaN(syncedMs)) return true;
  return now - syncedMs >= ANIME_TRACKER_SYNC_STALE_MS;
}

export async function runAnimeTrackerFullSync(): Promise<AnimeTrackerFullSyncResult> {
  const serviceRole = createServiceRoleClient();
  if (!serviceRole) {
    throw new Error("Service role not configured");
  }

  const schedule = await syncJikanReleasesToDatabase();
  const trending = await syncTrendingSpotlightToDatabase();

  await serviceRole.rpc("refresh_short_anime_match_tags");

  const { data: syncedAt, error } = await serviceRole.rpc("record_anime_tracker_sync", {
    p_schedule_synced: schedule.synced,
    p_schedule_errors: schedule.syncErrors,
    p_clashes_opened: schedule.clashesOpened,
    p_trending_synced: trending.synced,
    p_trending_errors: trending.syncErrors,
    p_details: { schedule, trending },
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    schedule,
    trending,
    syncedAt: syncedAt ?? new Date().toISOString(),
  };
}

export async function runAnimeTrackerAutoSyncIfStale(): Promise<AnimeTrackerFullSyncResult | null> {
  const lastSyncedAt = await getAnimeTrackerLastSyncedAt();
  if (!isAnimeTrackerSyncStale(lastSyncedAt)) {
    return null;
  }

  return runAnimeTrackerFullSync();
}
