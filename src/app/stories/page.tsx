import type { Metadata } from "next";
import { StoriesLibraryContent } from "@/components/stories/StoriesLibraryContent";
import { buildPageMetadata } from "@/lib/seoMetadata";

export const metadata: Metadata = buildPageMetadata("stories");

export default function StoriesPage() {
  return <StoriesLibraryContent />;
}
