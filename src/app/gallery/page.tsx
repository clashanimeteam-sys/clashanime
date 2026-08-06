import type { Metadata } from "next";
import { ContentHubPageContent } from "@/components/ContentHubPageContent";
import { buildPageMetadata } from "@/lib/seoMetadata";

export const metadata: Metadata = buildPageMetadata("gallery");

export default function GalleryPage() {
  return <ContentHubPageContent hub="gallery" />;
}
