import type { Metadata } from "next";
import { BlogIndexContent } from "@/components/blog/BlogIndexContent";
import { buildPageMetadata } from "@/lib/seoMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("blog");
}

export default function BlogPage() {
  return <BlogIndexContent />;
}
