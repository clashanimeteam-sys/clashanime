import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostContent } from "@/components/blog/BlogPostContent";
import { getBlogPost, getBlogPostCopy, getBlogSlugs } from "@/lib/blog/posts";
import { buildPageMetadata } from "@/lib/seoMetadata";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  const copy = getBlogPostCopy(slug, "en");

  if (!post || !copy) {
    return { title: "Article not found" };
  }

  return buildPageMetadata("blog", {
    title: copy.title,
    description: copy.excerpt,
    path: `/blog/${slug}`,
    ogType: "article",
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  return (
    <BlogPostContent
      slug={slug}
      category={post.category}
      publishedAt={post.publishedAt}
      readingMinutes={post.readingMinutes}
    />
  );
}
