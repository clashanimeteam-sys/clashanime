import type { Metadata } from "next";
import { LegalHubPageContent } from "@/components/LegalHubPageContent";

export const metadata: Metadata = {
  title: "Information & Legal — Clash Anime",
  description:
    "Terms of use, community guidelines, privacy policy, DMCA, and contact options for Clash Anime.",
};

export default function LegalPage() {
  return <LegalHubPageContent />;
}
