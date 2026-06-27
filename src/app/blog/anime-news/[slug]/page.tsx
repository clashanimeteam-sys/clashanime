import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { AnimeNewsArticleContent } from "@/components/blog/AnimeNewsArticleContent";
import {
  buildAnimeNewsAlternateHeadlines,
  buildAnimeNewsArticleKeywords,
  buildAnimeNewsTrilingualDescription,
  buildAnimeNewsTrilingualHeadline,
} from "@/lib/animeNews/seo";
import {
  getPublishedAnimeNewsBySlug,
  listPublishedAnimeNews,
} from "@/lib/animeNews.server";
import {
  FEATURED_SEASONAL_GUIDE_SLUG,
  featuredGuideToArticle,
} from "@/lib/animeNews/seasonalGuide";
import { absoluteSiteUrl } from "@/lib/siteSeo";
import { buildBlogHubJsonLd, buildNewsArticleJsonLd, buildPageMetadata, PAGE_SEO } from "@/lib/seoMetadata";

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

  const headline = buildAnimeNewsTrilingualHeadline(article);
  const description = buildAnimeNewsTrilingualDescription(article);
  const keywords = buildAnimeNewsArticleKeywords(article);

  return buildPageMetadata("animeNews", {
    title: headline,
    description,
    path: `/blog/anime-news/${slug}`,
    ogType: "article",
    image: article.cover_image_url ?? undefined,
    publishedTime: article.published_at,
    modifiedTime: article.updated_at,
    authors: article.source_author ? [article.source_author, "Clash Anime"] : ["Clash Anime"],
    tags: article.topics,
    extraKeywords: keywords,
  });
}

export default async function AnimeNewsArticlePage({ params }: AnimeNewsArticlePageProps) {
  const { slug } = await params;
  const article = await resolveArticle(slug);

  if (!article) notFound();

  const all = await listPublishedAnimeNews(12, 0);
  const related = all.filter((item) => item.slug !== slug).slice(0, 6);

  const url = absoluteSiteUrl(`/blog/anime-news/${slug}`);
  const headline = buildAnimeNewsTrilingualHeadline(article);
  const description = buildAnimeNewsTrilingualDescription(article);

  return (
    <>
      <JsonLd
        data={buildNewsArticleJsonLd({
          headline,
          alternateHeadlines: buildAnimeNewsAlternateHeadlines(article),
          description,
          url,
          datePublished: article.published_at,
          dateModified: article.updated_at,
          image: article.cover_image_url,
          keywords: buildAnimeNewsArticleKeywords(article),
          authorName: article.source_author,
        })}
      />
      <AnimeNewsArticleContent article={article} related={related} />
    </>
  );
}
