import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ClashAnime — Anime Duel Grid",
    template: "%s | ClashAnime",
  },
  description:
    "Watch anime duels ranked in real time. Like, comment, and climb the trending grid on ClashAnime.com.",
  metadataBase: new URL("https://www.clashanime.com"),
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "ClashAnime — Anime Duel Grid",
    description:
      "Anime duels ranked by community engagement. Share clips and climb the grid.",
    siteName: "ClashAnime",
    type: "website",
    images: [{ url: "/logo.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-black dark:bg-black dark:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
