import type { Metadata } from "next";
import { AboutPageContent } from "@/components/AboutPageContent";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about ClashAnime — the global anime duel platform built for real-time competition, community, and ClashCoins.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
