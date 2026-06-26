import { buildShortMatchTags } from "@/lib/animeTracker";
import { fetchJikanAnimeDetail } from "@/lib/jikan";
import { createServiceRoleClient } from "@/lib/supabase/admin";

const DETAIL_FETCH_DELAY_MS = 400;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function syncTrendingSpotlightToDatabase() {
  const serviceRole = createServiceRoleClient();
  if (!serviceRole) {
    throw new Error("Service role not configured");
  }

  const { data: seeds, error: seedsError } = await serviceRole
    .from("anime_trending_spotlight")
    .select("id, rank, mal_id, short_tags")
    .eq("active", true)
    .order("rank", { ascending: true });

  if (seedsError) {
    throw new Error(seedsError.message);
  }

  let synced = 0;
  let syncErrors = 0;
  let clashesOpened = 0;

  for (const seed of seeds ?? []) {
    try {
      const detail = await fetchJikanAnimeDetail(seed.mal_id);
      if (!detail) {
        syncErrors += 1;
        await sleep(DETAIL_FETCH_DELAY_MS);
        continue;
      }

      const matchTags =
        Array.isArray(seed.short_tags) && seed.short_tags.length > 0
          ? seed.short_tags
          : buildShortMatchTags(detail.title, detail.matchTags);

      const { data: releaseId, error: upsertError } = await serviceRole.rpc(
        "upsert_anime_release_from_trending_sync",
        {
          p_mal_id: detail.malId,
          p_title: detail.title,
          p_title_ja: detail.titleJapanese,
          p_poster_url: detail.posterUrl,
          p_synopsis_en: detail.synopsis,
          p_match_tags: matchTags,
          p_mal_score: detail.score,
          p_episodes_total: detail.episodes,
          p_broadcast_label: detail.broadcastLabel,
          p_airing_status: detail.status,
          p_episode_number: 1,
        },
      );

      if (upsertError || !releaseId) {
        syncErrors += 1;
        await sleep(DETAIL_FETCH_DELAY_MS);
        continue;
      }

      const { error: linkError } = await serviceRole
        .from("anime_trending_spotlight")
        .update({
          release_id: releaseId,
          synced_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", seed.id);

      if (linkError) {
        syncErrors += 1;
        await sleep(DETAIL_FETCH_DELAY_MS);
        continue;
      }

      const { data: clashId, error: clashError } = await serviceRole.rpc(
        "open_trending_spotlight_clash",
        { p_release_id: releaseId },
      );

      if (clashError) {
        syncErrors += 1;
      } else {
        synced += 1;
        if (clashId) clashesOpened += 1;
      }
    } catch {
      syncErrors += 1;
    }

    await sleep(DETAIL_FETCH_DELAY_MS);
  }

  return { synced, syncErrors, clashesOpened, total: seeds?.length ?? 0 };
}
