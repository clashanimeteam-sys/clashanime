import { enrichFeaturedAnimeCatalog } from "@/lib/animeNews/featuredAnimeEnrich";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export async function syncFeaturedAnimeCatalog(): Promise<{
  count: number;
  enriched: number;
}> {
  const serviceRole = createServiceRoleClient();
  if (!serviceRole) {
    throw new Error("Service role not configured");
  }

  const entries = await enrichFeaturedAnimeCatalog();
  const syncedAt = new Date().toISOString();

  const { error } = await serviceRole.from("anime_spotlight_catalog").upsert(
    {
      id: "main",
      entries,
      synced_at: syncedAt,
      updated_at: syncedAt,
    },
    { onConflict: "id" },
  );

  if (error) {
    throw new Error(error.message);
  }

  return {
    count: entries.length,
    enriched: entries.filter((entry) => entry.posterUrl && entry.synopsis).length,
  };
}
