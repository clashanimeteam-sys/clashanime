import type { JikanAnimeEntry } from "@/lib/jikan";
import { fetchJikanAiringSchedule, fetchJikanSynopsisMap } from "@/lib/jikan";
import { createServiceRoleClient } from "@/lib/supabase/admin";

const SYNC_BATCH_SIZE = 20;

export async function syncJikanReleasesToDatabase(entries?: JikanAnimeEntry[]) {
  const serviceRole = createServiceRoleClient();
  if (!serviceRole) {
    throw new Error("Service role not configured");
  }

  const schedule = entries ?? (await fetchJikanAiringSchedule(7));
  const synopsisMap = await fetchJikanSynopsisMap(schedule.map((entry) => entry.malId));
  let synced = 0;
  let syncErrors = 0;

  for (let i = 0; i < schedule.length; i += SYNC_BATCH_SIZE) {
    const batch = schedule.slice(i, i + SYNC_BATCH_SIZE);
    const results = await Promise.all(
      batch.map((entry) => {
        const synopsisEn = entry.synopsisEn ?? synopsisMap.get(entry.malId) ?? null;
        return serviceRole.rpc("upsert_anime_release_from_jikan_sync", {
          p_mal_id: entry.malId,
          p_title: entry.title,
          p_release_date: entry.releaseDate,
          p_episode_number: entry.episodeNumber,
          p_airs_at: entry.airsAt,
          p_poster_url: entry.posterUrl,
          p_title_ja: entry.titleJapanese,
          p_match_tags: entry.matchTags,
          p_synopsis_en: synopsisEn,
          p_synopsis_ar: entry.synopsisAr ?? null,
          p_synopsis_ja: entry.synopsisJa ?? null,
        });
      }),
    );

    for (const { error } of results) {
      if (error) syncErrors += 1;
      else synced += 1;
    }
  }

  const { data: openedCount, error: processError } = await serviceRole.rpc(
    "process_due_anime_release_clashes",
  );

  if (processError) {
    throw new Error(processError.message);
  }

  return {
    synced,
    syncErrors,
    clashesOpened: openedCount ?? 0,
  };
}
