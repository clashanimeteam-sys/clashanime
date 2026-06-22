import type { JikanAnimeEntry } from "@/lib/jikan";
import { fetchJikanAiringSchedule } from "@/lib/jikan";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export async function syncJikanReleasesToDatabase(entries?: JikanAnimeEntry[]) {
  const serviceRole = createServiceRoleClient();
  if (!serviceRole) {
    throw new Error("Service role not configured");
  }

  const schedule = entries ?? (await fetchJikanAiringSchedule(14));
  let synced = 0;
  let syncErrors = 0;

  for (const entry of schedule) {
    const { error } = await serviceRole.rpc("upsert_anime_release_from_jikan_sync", {
      p_mal_id: entry.malId,
      p_title: entry.title,
      p_release_date: entry.releaseDate,
      p_episode_number: entry.episodeNumber,
      p_airs_at: entry.airsAt,
      p_poster_url: entry.posterUrl,
      p_title_ja: entry.titleJapanese,
      p_match_tags: entry.matchTags,
    });

    if (error) syncErrors += 1;
    else synced += 1;
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
