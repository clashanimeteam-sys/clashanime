import type { AnimeNewsArticle } from "@/lib/animeNews/types";
import { createPublicSupabaseClient } from "@/lib/supabase/public";

export async function listPublishedAnimeNews(limit = 24, offset = 0): Promise<AnimeNewsArticle[]> {
  try {
    const supabase = createPublicSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase.rpc("list_anime_news_published", {
      p_limit: limit,
      p_offset: offset,
    });

    if (error) {
      console.error("listPublishedAnimeNews", error.message);
      return [];
    }

    return (data as AnimeNewsArticle[]) ?? [];
  } catch (error) {
    console.error("listPublishedAnimeNews", error);
    return [];
  }
}

export async function getPublishedAnimeNewsBySlug(slug: string): Promise<AnimeNewsArticle | null> {
  try {
    const supabase = createPublicSupabaseClient();
    if (!supabase) return null;

    const { data, error } = await supabase.rpc("get_anime_news_published_by_slug", {
      p_slug: slug,
    });

    if (error || !data) {
      return null;
    }

    return data as AnimeNewsArticle;
  } catch {
    return null;
  }
}

export async function listPublishedAnimeNewsSlugs(limit = 100): Promise<string[]> {
  const articles = await listPublishedAnimeNews(limit, 0);
  return articles.map((article) => article.slug);
}
