import type { Metadata } from "next";
import { CommunityGuidelinesPageContent } from "@/components/CommunityGuidelinesPageContent";

export const metadata: Metadata = {
  title: "Community Guidelines",
  description: "Original content only. No re-uploads. Rules for ClashAnime creators.",
};

export default function CommunityGuidelinesPage() {
  return <CommunityGuidelinesPageContent />;
}
