import type { Metadata } from "next";
import { getAdSenseClientId } from "@/lib/adsense";
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
  | "earn"
  | "blog"
  | "animeNews"
  | "watch"
  | "faq"
  | "howItWorks"
  | "stories"
  | "manga"
  | "gallery";

export const PAGE_SEO: Record<
  PageSeoKey,
  { title: string; description: string; path: string }
> = {
  home: {
    title: "Clash Anime — Stories, Manga, Images, Radar & Anime Radio",
    description:
      "Copyright-safe anime culture hub: original stories and essays, manga notes, image moodboards, release radar, anime radio, and Heroes Guide — قصص ومانغا وصور ورادار وراديو — 物語・マンガ・画像・レーダー・ラジオ.",
    path: "/",
  },
  stories: {
    title: "Anime Stories & Tales — Original Essays | ClashAnime",
    description:
      "Original anime storytelling essays and cultural notes. Text-first, copyright-safe commentary — قصص وحكايات أنمي — アニメ物語エッセイ.",
    path: "/stories",
  },
  manga: {
    title: "Manga Notes — Panels, Pacing & Reading Culture | ClashAnime",
    description:
      "Educational manga craft notes without scanlations — ملاحظات مانغا — マンガノート.",
    path: "/manga",
  },
  gallery: {
    title: "Image Moodboard — Visual Inspiration | ClashAnime",
    description:
      "Atmosphere and composition inspiration without stolen key-art dumps — معرض صور — 画像ムードボード.",
    path: "/gallery",
  },
  tracker: {
    title: "Anime Radar — New Episodes & Upcoming Releases",
    description:
      "Follow anime episode calendars and upcoming releases — رادار حلقات الأنمي — アニメ放送予定.",
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
    title: "About Clash Anime — Stories, Manga & Culture Hub",
    description:
      "ClashAnime.com is a copyright-safe anime culture site for stories, manga notes, images, radar, radio, and Heroes Guide — منصة ثقافة أنمي آمنة — 著作権に配慮したアニカルチャー.",
    path: "/about",
  },
  faq: {
    title: "ClashAnime FAQ — Stories, Copyright & Safe Browsing",
    description:
      "Answers about ClashAnime stories, manga notes, copyright stance, privacy, and how to explore the hub — الأسئلة الشائعة — よくある質問.",
    path: "/faq",
  },
  howItWorks: {
    title: "How ClashAnime Works — Content Hubs Explained",
    description:
      "Learn how Stories, Manga, Images, Radar, Radio, and Heroes Guide fit together — كيف يعمل الموقع — 仕組みガイド.",
    path: "/how-it-works",
  },
  earn: {
    title: "Earn Money — Promote Clash Anime & Get $2 Rewards",
    description:
      "Earn $2 in ClashCoins for YouTube videos, forum posts, and blog articles that promote Clash Anime. Submit your link and get paid after review — اربح الأموال — お金を稼ぐ.",
    path: "/earn",
  },
  blog: {
    title: "Heroes Guide — ClashAnime Editorial Blog",
    description:
      "Editorial guides, anime news summaries, and culture notes for a copyright-safe fandom hub — دليل الأبطال — ヒーローズガイド.",
    path: "/blog",
  },
  animeNews: {
    title: "Latest Anime News — ClashAnime Editorial Hub",
    description:
      "Curated anime headlines in English, Arabic, and Japanese. Summaries by ClashAnime with links to Crunchyroll sources — آخر أخبار الأنمي — 最新アニメニュース.",
    path: "/blog/anime-news",
  },
  watch: {
    title: "Watch Anime — Coming soon | ClashAnime",
    description:
      "Watch Anime is coming soon on ClashAnime. Join the arena, upload duel clips, and climb hunter ranks.",
    path: "/watch",
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
  /** When false, page is noindex/nofollow (e.g. member-only /watch). */
  indexable?: boolean;
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
  const indexable = options.indexable !== false;

  return {
    title,
    description,
    keywords,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
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
  const adSenseClientId = getAdSenseClientId();
  return {
    ...home,
    metadataBase: new URL(SITE_URL),
    title: {
      default: "Clash Anime",
      template: "%s | Clash Anime",
    },
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "Clash Anime",
    },
    other: {
      "mobile-web-app-capable": "yes",
      google: "notranslate",
      ...(adSenseClientId ? { "google-adsense-account": adSenseClientId } : {}),
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
