import type { Metadata } from "next";
import { PrivacyPageContent } from "@/components/PrivacyPageContent";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ClashAnime collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return <PrivacyPageContent />;
}
