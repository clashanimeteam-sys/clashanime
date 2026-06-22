import type { Metadata } from "next";
import { EulaPageContent } from "@/components/EulaPageContent";

export const metadata: Metadata = {
  title: "End-User License Agreement",
  description: "Clash Anime end-user license agreement (EULA).",
};

export default function EulaPage() {
  return <EulaPageContent />;
}
