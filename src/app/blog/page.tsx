import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { BlogIndexContent } from "@/components/blog/BlogIndexContent";
import { buildBlogHubKeywords } from "@/lib/blog/seo";
import { absoluteSiteUrl } from "@/lib/siteSeo";
import { buildBlogHubJsonLd, buildPageMetadata, PAGE_SEO } from "@/lib/seoMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("blog", {
    extraKeywords: buildBlogHubKeywords(),
  });
}

export default function BlogPage() {
  const config = PAGE_SEO.blog;

  return (
    <>
      <JsonLd
        data={buildBlogHubJsonLd({
          title: config.title,
          description: config.description,
          url: absoluteSiteUrl(config.path),
        })}
      />
      <BlogIndexContent />
    </>
  );
}
