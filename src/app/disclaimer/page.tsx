import type { Metadata } from "next";
import { DisclaimerPageContent } from "@/components/DisclaimerPageContent";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Clash Anime legal disclaimer and disclosures.",
};

export default function DisclaimerPage() {
  return <DisclaimerPageContent />;
}
