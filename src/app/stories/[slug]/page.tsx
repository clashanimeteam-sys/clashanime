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
  if (!copy) return { title: "Story" };
  return {
    title: `${copy.title} | ClashAnime Stories`,
    description: copy.excerpt,
    alternates: { canonical: absoluteSiteUrl(`/stories/${slug}`) },
  };
}

export default async function StoryArticlePage({ params }: PageProps) {
  const { slug } = await params;
  if (!getStoryArticle(slug)) notFound();
  return <StoryArticleContent slug={slug} />;
}
