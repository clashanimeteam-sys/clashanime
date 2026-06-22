import type { Metadata } from "next";
import { CookiesPageContent } from "@/components/CookiesPageContent";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How Clash Anime uses cookies and similar technologies.",
};

export default function CookiesPage() {
  return <CookiesPageContent />;
}
