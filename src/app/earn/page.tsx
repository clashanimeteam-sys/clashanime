import type { Metadata } from "next";
import { EarnMoneyPageContent } from "@/components/EarnMoneyPageContent";
import { buildPageMetadata } from "@/lib/seoMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("earn");
}

export default function EarnPage() {
  return <EarnMoneyPageContent />;
}
