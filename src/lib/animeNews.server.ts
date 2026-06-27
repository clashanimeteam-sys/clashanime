import type { AnimeNewsArticle } from "@/lib/animeNews/types";
import { createServerClient } from "@/lib/supabase/server";

export async function listPublishedAnimeNews(limit = 24, offset = 0): Promise<AnimeNewsArticle[]> {
  const supabase = await createServerClient();
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
}

export async function getPublishedAnimeNewsBySlug(slug: string): Promise<AnimeNewsArticle | null> {
  const supabase = await createServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("get_anime_news_published_by_slug", {
    p_slug: slug,
  });

  if (error || !data) {
    return null;
  }

  return data as AnimeNewsArticle;
}

export async function listPublishedAnimeNewsSlugs(limit = 100): Promise<string[]> {
  const articles = await listPublishedAnimeNews(limit, 0);
  return articles.map((article) => article.slug);
}
