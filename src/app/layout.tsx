import type { Metadata } from "next";
import { Cairo, Geist, Geist_Mono, Orbitron, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Clash Anime",
    template: "%s | Clash Anime",
  },
  description:
    "Watch anime duels ranked in real time. Like, comment, and climb the trending grid on ClashAnime.com.",
  metadataBase: new URL("https://www.clashanime.com"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-dark.ico", sizes: "any", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.png", type: "image/png", sizes: "512x512", media: "(prefers-color-scheme: light)" },
      {
        url: "/icon-dark-512.png",
        type: "image/png",
        sizes: "512x512",
        media: "(prefers-color-scheme: dark)",
      },
      { url: "/icon-32.png", type: "image/png", sizes: "32x32", media: "(prefers-color-scheme: light)" },
      {
        url: "/icon-dark-32.png",
        type: "image/png",
        sizes: "32x32",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: [
      { url: "/icon-180.png", sizes: "180x180", type: "image/png", media: "(prefers-color-scheme: light)" },
      {
        url: "/icon-dark-180.png",
        sizes: "180x180",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
  openGraph: {
    title: "Clash Anime",
    description:
      "Anime clips ranked by community engagement. Share videos and climb the grid on ClashAnime.com.",
    siteName: "Clash Anime",
    type: "website",
    images: [{ url: "/icon.png", width: 512, height: 512, alt: "Clash Anime" }],
  },
  twitter: {
    card: "summary",
    title: "Clash Anime",
    description:
      "Anime clips ranked by community engagement. Share videos and climb the grid on ClashAnime.com.",
    images: ["/icon.png"],
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
      className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${plusJakarta.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-black dark:bg-black dark:text-white">
        <Providers>{children}</Providers>
        <div id="clashanime-portal" />
      </body>
    </html>
  );
}
