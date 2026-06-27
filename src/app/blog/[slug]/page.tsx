import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { BlogPostContent } from "@/components/blog/BlogPostContent";
import { getBlogPost, getBlogSlugs } from "@/lib/blog/posts";
import {
  buildBlogAlternateHeadlines,
  buildBlogPostKeywords,
  buildBlogTrilingualDescription,
  buildBlogTrilingualHeadline,
} from "@/lib/blog/seo";
import { absoluteSiteUrl } from "@/lib/siteSeo";
import { buildBlogPostingJsonLd, buildPageMetadata } from "@/lib/seoMetadata";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return { title: "Article not found" };
  }

  const headline = buildBlogTrilingualHeadline(post);
  const description = buildBlogTrilingualDescription(post);

  return buildPageMetadata("blog", {
    title: headline,
    description,
    path: `/blog/${slug}`,
    ogType: "article",
    publishedTime: post.publishedAt,
    tags: [post.category],
    extraKeywords: buildBlogPostKeywords(post),
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  const url = absoluteSiteUrl(`/blog/${slug}`);
  const headline = buildBlogTrilingualHeadline(post);
  const description = buildBlogTrilingualDescription(post);

  return (
    <>
      <JsonLd
        data={buildBlogPostingJsonLd({
          headline,
          alternateHeadlines: buildBlogAlternateHeadlines(post),
          description,
          url,
          datePublished: post.publishedAt,
          keywords: buildBlogPostKeywords(post),
          articleSection: post.category,
        })}
      />
      <BlogPostContent
        slug={slug}
        category={post.category}
        publishedAt={post.publishedAt}
        readingMinutes={post.readingMinutes}
      />
    </>
  );
}
