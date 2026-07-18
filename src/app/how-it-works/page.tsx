import type { Metadata } from "next";
import { HowItWorksPageContent } from "@/components/HowItWorksPageContent";
import { buildPageMetadata } from "@/lib/seoMetadata";

export const metadata: Metadata = buildPageMetadata("howItWorks");

export default function HowItWorksPage() {
  return <HowItWorksPageContent />;
}
