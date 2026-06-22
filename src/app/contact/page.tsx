import type { Metadata } from "next";
import { ContactPageContent } from "@/components/ContactPageContent";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact ClashAnime support — report issues, ask about ClashCoins, or get help with your account.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
