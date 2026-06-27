import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnimeNewsArticleContent } from "@/components/blog/AnimeNewsArticleContent";
import {
  getPublishedAnimeNewsBySlug,
  listPublishedAnimeNews,
} from "@/lib/animeNews.server";
import {
  FEATURED_SEASONAL_GUIDE_SLUG,
  featuredGuideToArticle,
} from "@/lib/animeNews/seasonalGuide";
import { getAnimeNewsCopy } from "@/lib/animeNews/types";
import { buildPageMetadata } from "@/lib/seoMetadata";

export const dynamic = "force-dynamic";

type AnimeNewsArticlePageProps = {
  params: Promise<{ slug: string }>;
};

async function resolveArticle(slug: string) {
  const article = await getPublishedAnimeNewsBySlug(slug);
  if (article) return article;
  if (slug === FEATURED_SEASONAL_GUIDE_SLUG) return featuredGuideToArticle();
  return null;
}

export async function generateMetadata({ params }: AnimeNewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await resolveArticle(slug);
  if (!article) {
    return { title: "Article not found" };
  }

  const copy = getAnimeNewsCopy(article, "en");

  return buildPageMetadata("animeNews", {
    title: copy.title,
    description: copy.excerpt ?? undefined,
    path: `/blog/anime-news/${slug}`,
    ogType: "article",
    image: article.cover_image_url ?? undefined,
  });
}

export default async function AnimeNewsArticlePage({ params }: AnimeNewsArticlePageProps) {
  const { slug } = await params;
  const article = await resolveArticle(slug);

  if (!article) notFound();

  const all = await listPublishedAnimeNews(6, 0);
  const related = all.filter((item) => item.slug !== slug).slice(0, 4);

  return <AnimeNewsArticleContent article={article} related={related} />;
}
