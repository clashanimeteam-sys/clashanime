import { buildSummer2026SeasonalLineup } from "@/lib/animeNews/summer2026Lineup";
import { enrichSeasonalLineup } from "@/lib/animeNews/seasonalLineupEnrich";
import { FEATURED_SEASONAL_GUIDE } from "@/lib/animeNews/seasonalGuide";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export async function syncFeaturedSeasonalGuide(): Promise<{
  upserted: boolean;
  slug: string;
  lineupCount: number;
  lineupEnriched: number;
}> {
  const serviceRole = createServiceRoleClient();
  if (!serviceRole) {
    throw new Error("Service role not configured");
  }

  const guide = FEATURED_SEASONAL_GUIDE;
  const syncedAt = new Date().toISOString();
  const seasonalLineup = await enrichSeasonalLineup(buildSummer2026SeasonalLineup());

  const { error: upsertError } = await serviceRole.from("anime_news_articles").upsert(
    {
      slug: guide.slug,
      source_guid: guide.sourceGuid,
      source_url: guide.sourceUrl,
      source_author: "Crunchyroll News",
      source_category: "Seasonal Lineup",
      cover_image_url: guide.coverImageUrl,
      topics: [...guide.topics],
      published_at: guide.publishedAt,
      status: "published",
      is_featured: true,
      featured_order: 100,
      title_en: guide.locales.en.title,
      title_ar: guide.locales.ar.title,
      title_ja: guide.locales.ja.title,
      excerpt_en: guide.locales.en.excerpt,
      excerpt_ar: guide.locales.ar.excerpt,
      excerpt_ja: guide.locales.ja.excerpt,
      story_en: guide.locales.en.story,
      story_ar: guide.locales.ar.story,
      story_ja: guide.locales.ja.story,
      feed_synced_at: syncedAt,
      updated_at: syncedAt,
    },
    { onConflict: "source_guid" },
  );

  if (upsertError) {
    throw new Error(upsertError.message);
  }

  const { error: lineupError } = await serviceRole
    .from("anime_news_articles")
    .update({ seasonal_lineup: seasonalLineup, feed_synced_at: syncedAt, updated_at: syncedAt })
    .eq("source_guid", guide.sourceGuid);

  if (lineupError) {
    console.error("syncFeaturedSeasonalGuide lineup", lineupError.message);
    return {
      upserted: true,
      slug: guide.slug,
      lineupCount: seasonalLineup.length,
      lineupEnriched: seasonalLineup.filter((entry) => entry.posterUrl && entry.story).length,
    };
  }

  return {
    upserted: true,
    slug: guide.slug,
    lineupCount: seasonalLineup.length,
    lineupEnriched: seasonalLineup.filter((entry) => entry.posterUrl && entry.story).length,
  };
}
