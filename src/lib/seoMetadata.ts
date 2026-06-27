import type { Metadata } from "next";
import { absoluteSiteUrl, SITE_URL } from "@/lib/siteSeo";
import {
  buildAnimeDynamicKeywords,
  buildAnimeDynamicKeywordsFromTitles,
  collectStaticSeoKeywords,
  dedupeKeywords,
  type AnimeSeoEntry,
} from "@/lib/seoKeywords";

export const SITE_NAME = "Clash Anime";

export function buildSeoKeywords(extraTitles: string[] = [], dbAnime?: AnimeSeoEntry[]): string[] {
  const dynamicFromDb = dbAnime?.length
    ? buildAnimeDynamicKeywords(dbAnime)
    : buildAnimeDynamicKeywordsFromTitles(extraTitles);

  return dedupeKeywords([...collectStaticSeoKeywords(), ...dynamicFromDb]);
}

type PageSeoKey =
  | "home"
  | "tracker"
  | "videos"
  | "community"
  | "exclusives"
  | "music"
  | "about"
  | "blog"
  | "animeNews";

export const PAGE_SEO: Record<
  PageSeoKey,
  { title: string; description: string; path: string }
> = {
  home: {
    title: "Clash Anime — Anime Duels, Challenges & Earn Real Prizes 2026",
    description:
      "Best anime challenge site 2026: vote on fights, upload clips, join release clashes for JJK, Solo Leveling, Demon Slayer, One Piece and more. Earn ClashCoins and compete for top clip — أفضل موقع لتحديات الأنمي وربح المال — アニメ対戦・投票・賞金プラットフォーム.",
    path: "/",
  },
  tracker: {
    title: "Anime Tracker — New Episodes, Upcoming Releases & Clashes",
    description:
      "Follow today's anime episodes and upcoming releases. Trending spotlight for Jujutsu Kaisen, Sakamoto Days, MHA, Dandadan and more. Join #clashanime release contests — متتبع حلقات الانمي والمسابقات — 新作アニメ・放送予定.",
    path: "/tracker",
  },
  videos: {
    title: "Anime Clips & Short Videos — Trending Grid",
    description:
      "Browse ranked anime short clips. Like, comment, and climb the trending grid. Upload with hashtags and compete in community duels — مقاطع انمي قصيرة ومسابقات — アニメクリップ・ランキング.",
    path: "/videos",
  },
  community: {
    title: "Anime Community — Posts, Discussions & Contests",
    description:
      "Join the Clash Anime community. Share posts, discuss episodes, and enter competitions. Connect with creators worldwide — مجتمع الانمي ومسابقات — アニメコミュニティ.",
    path: "/community",
  },
  exclusives: {
    title: "Exclusives — Top 12, Hall of Legends & Cash Prize Duels",
    description:
      "Exclusive anime clips, Top 12 challenge, Hall of Legends, daily interaction kings, and cash prize duels. Season leaders and combat moment challenges — لقطات حصرية وجوائز نقدية — 限定クリップ・賞金対戦.",
    path: "/exclusives",
  },
  music: {
    title: "Anime Beats Lounge — Music & Soundtracks",
    description:
      "Listen to curated anime beats and soundtrack vibes from the Clash Anime lounge — موسيقى انمي — アニメ音楽.",
    path: "/music",
  },
  about: {
    title: "About Clash Anime — Global Anime Duel Platform",
    description:
      "ClashAnime.com is a global platform for anime clips, release clashes, competitions, and creator rewards via ClashCoins — منصة انمي عالمية للمسابقات وربح المال — グローバルアニメ対戦プラットフォーム.",
    path: "/about",
  },
  blog: {
    title: "Heroes' Arena Guide — ClashAnime Blog & SEO Knowledge Hub",
    description:
      "Guides to anime clashes, Anime Radar trends, winner stories, platform updates, prizes, ClashCoins, and FAQ. Learn how to rank and earn on ClashAnime — دليل الأبطال وSEO — 英雄アリーナガイド.",
    path: "/blog",
  },
  animeNews: {
    title: "Latest Anime News — ClashAnime Editorial Hub",
    description:
      "Curated anime headlines in English, Arabic, and Japanese. Summaries by ClashAnime with links to Crunchyroll sources — آخر أخبار الأنمي — 最新アニメニュース.",
    path: "/blog/anime-news",
  },
};

type BuildPageMetadataOptions = {
  extraKeywords?: string[];
  dbAnime?: AnimeSeoEntry[];
  title?: string;
  description?: string;
  path?: string;
  ogType?: "website" | "article";
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
};

function buildOpenGraphArticleFields(options: BuildPageMetadataOptions) {
  if (options.ogType !== "article") return {};

  return {
    publishedTime: options.publishedTime,
    modifiedTime: options.modifiedTime ?? options.publishedTime,
    authors: options.authors,
    tags: options.tags,
  };
}

export function buildPageMetadata(
  page: PageSeoKey,
  options: BuildPageMetadataOptions = {},
): Metadata {
  const config = PAGE_SEO[page];
  const title = options.title ?? config.title;
  const description = options.description ?? config.description;
  const path = options.path ?? config.path;
  const canonical = absoluteSiteUrl(path);
  const keywords = buildSeoKeywords(options.extraKeywords ?? [], options.dbAnime);
  const imageUrl = options.image ?? "/logo2.png";
  const ogImage = options.image?.startsWith("http")
    ? options.image
    : absoluteSiteUrl(imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`);

  return {
    title,
    description,
    keywords,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical,
      languages: {
        en: canonical,
        ar: canonical,
        ja: canonical,
        "x-default": canonical,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: options.ogType ?? "website",
      locale: "en_US",
      alternateLocale: ["ar_SA", "ja_JP"],
      ...buildOpenGraphArticleFields(options),
      images: [
        {
          url: ogImage,
          width: 1024,
          height: 1024,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function buildRootLayoutMetadata(): Metadata {
  const home = buildPageMetadata("home");
  return {
    ...home,
    metadataBase: new URL(SITE_URL),
    title: {
      default: "Clash Anime",
      template: "%s | Clash Anime",
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/logo2.png", type: "image/png", sizes: "1024x1024" },
        { url: "/icon-32.png", type: "image/png", sizes: "32x32" },
      ],
      apple: [{ url: "/logo2.png", sizes: "1024x1024", type: "image/png" }],
    },
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: ["ClashAnime", "كلاش انمي", "クラッシュアニメ"],
    url: SITE_URL,
    description: PAGE_SEO.home.description,
    inLanguage: ["en", "ar", "ja"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/videos?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteSiteUrl("/logo2.png"),
    sameAs: [],
  };
}

export function buildAnimeClashJsonLd(input: {
  title: string;
  description: string;
  url: string;
  image?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: input.title,
    description: input.description,
    url: input.url,
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "VirtualLocation",
      url: input.url,
    },
    organizer: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    image: input.image ? absoluteSiteUrl(input.image) : absoluteSiteUrl("/logo2.png"),
  };
}

const PUBLISHER_JSON_LD = {
  "@type": "Organization" as const,
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject" as const,
    url: absoluteSiteUrl("/logo2.png"),
  },
};

export function buildBlogPostingJsonLd(input: {
  headline: string;
  alternateHeadlines?: string[];
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string | null;
  keywords?: string[];
  articleSection?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.headline,
    ...(input.alternateHeadlines?.length
      ? { alternativeHeadline: input.alternateHeadlines }
      : {}),
    description: input.description,
    url: input.url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": input.url,
    },
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: PUBLISHER_JSON_LD,
    publisher: PUBLISHER_JSON_LD,
    inLanguage: ["en", "ar", "ja"],
    isAccessibleForFree: true,
    ...(input.keywords?.length ? { keywords: input.keywords.join(", ") } : {}),
    ...(input.articleSection ? { articleSection: input.articleSection } : {}),
    image: input.image ? absoluteSiteUrl(input.image) : absoluteSiteUrl("/logo2.png"),
  };
}

export function buildNewsArticleJsonLd(input: {
  headline: string;
  alternateHeadlines?: string[];
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string | null;
  keywords?: string[];
  authorName?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: input.headline,
    ...(input.alternateHeadlines?.length
      ? { alternativeHeadline: input.alternateHeadlines }
      : {}),
    description: input.description,
    url: input.url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": input.url,
    },
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: input.authorName
      ? { "@type": "Person", name: input.authorName }
      : PUBLISHER_JSON_LD,
    publisher: PUBLISHER_JSON_LD,
    inLanguage: ["en", "ar", "ja"],
    isAccessibleForFree: true,
    ...(input.keywords?.length ? { keywords: input.keywords.join(", ") } : {}),
    image: input.image ? absoluteSiteUrl(input.image) : absoluteSiteUrl("/logo2.png"),
  };
}

export function buildBlogHubJsonLd(input: { title: string; description: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: input.title,
    description: input.description,
    url: input.url,
    publisher: PUBLISHER_JSON_LD,
    inLanguage: ["en", "ar", "ja"],
  };
}
