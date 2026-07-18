import type { Metadata } from "next";
import { FaqPageContent } from "@/components/FaqPageContent";
import { buildPageMetadata } from "@/lib/seoMetadata";

export const metadata: Metadata = buildPageMetadata("faq");

export default function FaqPage() {
  return <FaqPageContent />;
}
