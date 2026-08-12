import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoryArticleContent } from "@/components/stories/StoryArticleContent";
import { getStoryArticle, getStoryCopy, getStorySlugs } from "@/lib/storiesLibrary";
import { absoluteSiteUrl } from "@/lib/siteSeo";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getStorySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const copy = getStoryCopy(slug, "en");
  if (!copy) return { title: "Story", robots: { index: false, follow: false } };

  const title = `${copy.title} | قصص أنمي — Clash Anime`;
  const description =
    copy.excerpt?.trim() ||
    `اقرأ مقالة ${copy.title} ضمن مكتبة قصص Clash Anime — مقالات أنمي أصلية.`;

  return {
    title: { absolute: title },
    description,
    keywords: [copy.title, "قصص أنمي", "مقالات أنمي", "Clash Anime Stories", "أنمي"],
    alternates: { canonical: absoluteSiteUrl(`/stories/${slug}`) },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: absoluteSiteUrl(`/stories/${slug}`),
      siteName: "Clash Anime",
      type: "article",
      locale: "ar_SA",
    },
  };
}

export default async function StoryArticlePage({ params }: PageProps) {
  const { slug } = await params;
  if (!getStoryArticle(slug)) notFound();
  return <StoryArticleContent slug={slug} />;
}
