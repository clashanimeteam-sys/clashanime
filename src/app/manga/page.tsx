import type { Metadata } from "next";
import { ContentHubPageContent } from "@/components/ContentHubPageContent";
import { buildPageMetadata } from "@/lib/seoMetadata";

export const metadata: Metadata = buildPageMetadata("manga");

export default function MangaPage() {
  return <ContentHubPageContent hub="manga" />;
}
