import {
  fetchCrunchyrollNewsFeed,
  parseRssPubDate,
  slugFromCrunchyrollUrl,
  storyTextFromRssItem,
  topicsFromRssItem,
} from "@/lib/animeNews/rss";
import { syncFeaturedSeasonalGuide } from "@/lib/animeNews/seasonalGuideSync";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export type AnimeNewsSyncResult = {
  fetched: number;
  inserted: number;
  updated: number;
  skipped: number;
  featuredGuideSlug: string | null;
  featuredLineupCount: number;
  featuredLineupEnriched: number;
  syncedAt: string;
};

export async function runAnimeNewsSync(limit = 30): Promise<AnimeNewsSyncResult> {
  const serviceRole = createServiceRoleClient();
  if (!serviceRole) {
    throw new Error("Service role not configured");
  }

  const items = await fetchCrunchyrollNewsFeed(limit);
  const syncedAt = new Date().toISOString();
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const item of items) {
    const slug = slugFromCrunchyrollUrl(item.link);
    const publishedAt = parseRssPubDate(item.pubDate);
    const topics = topicsFromRssItem(item);

    const storyEn = storyTextFromRssItem(item) || null;

    const { data: existing } = await serviceRole
      .from("anime_news_articles")
      .select("id, status, title_ar, title_ja, excerpt_ar, excerpt_ja, story_ar, story_ja")
      .eq("source_guid", item.guid)
      .maybeSingle();

    if (!existing) {
      const canPublish = Boolean(item.title.trim() && item.description.trim());

      const { error } = await serviceRole.from("anime_news_articles").insert({
        slug,
        source_guid: item.guid,
        source_url: item.link,
        source_author: item.author,
        source_category: item.category,
        cover_image_url: item.thumbnailUrl,
        topics,
        published_at: publishedAt,
        status: canPublish ? "published" : "draft",
        title_en: item.title,
        excerpt_en: item.description || null,
        story_en: storyEn,
        feed_synced_at: syncedAt,
        updated_at: syncedAt,
      });

      if (error) {
        if (error.code === "23505") {
          skipped += 1;
        } else {
          throw new Error(error.message);
        }
      } else {
        inserted += 1;
      }
      continue;
    }

    const patch: Record<string, unknown> = {
      source_url: item.link,
      source_author: item.author,
      source_category: item.category,
      cover_image_url: item.thumbnailUrl,
      published_at: publishedAt,
      feed_synced_at: syncedAt,
      updated_at: syncedAt,
    };

    if (existing.status === "draft") {
      patch.title_en = item.title;
      if (!existing.excerpt_ar && !existing.excerpt_ja) {
        patch.excerpt_en = item.description || null;
      }
      patch.topics = topics;
      if (item.title.trim() && item.description.trim()) {
        patch.status = "published";
      }
    }

    if (!existing.story_ar && !existing.story_ja) {
      patch.story_en = storyEn;
    }

    const { error } = await serviceRole
      .from("anime_news_articles")
      .update(patch)
      .eq("id", existing.id);

    if (error) {
      throw new Error(error.message);
    }

    updated += 1;
  }

  let featuredGuideSlug: string | null = null;
  let featuredLineupCount = 0;
  let featuredLineupEnriched = 0;
  try {
    const featured = await syncFeaturedSeasonalGuide();
    featuredGuideSlug = featured.slug;
    featuredLineupCount = featured.lineupCount;
    featuredLineupEnriched = featured.lineupEnriched;
  } catch (error) {
    console.error("syncFeaturedSeasonalGuide", error);
  }

  return {
    fetched: items.length,
    inserted,
    updated,
    skipped,
    featuredGuideSlug,
    featuredLineupCount,
    featuredLineupEnriched,
    syncedAt,
  };
}
