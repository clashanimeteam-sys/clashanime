import { Cairo, Geist, Geist_Mono, Orbitron, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/components/Providers";
import { AppBootSkeleton } from "@/components/AppBootSkeleton";
import { BlockTranslateScript } from "@/components/BlockTranslateScript";
import { ClientErrorBoundary } from "@/components/ClientErrorBoundary";
import { ClientOnly } from "@/components/ClientOnly";
import { buildRootLayoutMetadata } from "@/lib/seoMetadata";
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

export const metadata = buildRootLayoutMetadata();

export const viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      translate="no"
      suppressHydrationWarning
      className={`notranslate ${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${plusJakarta.variable} ${cairo.variable} h-full antialiased`}
    >
      <body
        translate="no"
        suppressHydrationWarning
        className="site-brand-bg notranslate min-h-full text-white"
      >
        <BlockTranslateScript />
        <ClientErrorBoundary>
          <ClientOnly fallback={<AppBootSkeleton />}>
            <Providers>{children}</Providers>
          </ClientOnly>
        </ClientErrorBoundary>
        <div id="clashanime-portal" />
      </body>
    </html>
  );
}
