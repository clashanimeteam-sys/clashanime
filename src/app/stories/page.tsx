import type { Metadata } from "next";
import { ContentHubPageContent } from "@/components/ContentHubPageContent";
import { buildPageMetadata } from "@/lib/seoMetadata";

export const metadata: Metadata = buildPageMetadata("stories");

export default function StoriesPage() {
  return <ContentHubPageContent hub="stories" />;
}
