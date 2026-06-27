export const CRUNCHYROLL_NEWS_RSS_URL =
  "https://cr-news-api-service.prd.crunchyrollsvc.com/v1/en-US/rss";

export type CrunchyrollRssItem = {
  title: string;
  description: string;
  contentEncoded: string;
  link: string;
  guid: string;
  pubDate: string;
  author: string | null;
  category: string | null;
  thumbnailUrl: string | null;
};

function decodeXmlEntities(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .trim();
}

function extractTag(block: string, tag: string): string {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeXmlEntities(match[1]) : "";
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

function truncateAtSentence(text: string, maxLength = 1400): string {
  if (text.length <= maxLength) return text;

  const slice = text.slice(0, maxLength);
  const lastBreak = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf(".\n"), slice.lastIndexOf("\n\n"));

  if (lastBreak > maxLength * 0.55) {
    return slice.slice(0, lastBreak + 1).trim();
  }

  return `${slice.trim()}…`;
}

export function storyTextFromRssItem(item: Pick<CrunchyrollRssItem, "contentEncoded" | "description">): string {
  const raw = item.contentEncoded.trim() || item.description.trim();
  if (!raw) return "";

  const plain = stripHtml(raw);
  return truncateAtSentence(plain);
}

function extractMediaThumbnail(block: string): string | null {
  const match = block.match(/<media:thumbnail[^>]+url="([^"]+)"/i);
  return match?.[1]?.trim() ?? null;
}

export function slugFromCrunchyrollUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname.replace(/\/+$/, "");
    const segment = pathname.split("/").filter(Boolean).pop();
    return segment?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ?? "anime-news";
  } catch {
    return "anime-news";
  }
}

export function topicsFromRssItem(item: CrunchyrollRssItem): string[] {
  const topics = new Set<string>();
  if (item.category) {
    topics.add(
      item.category
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    );
  }
  topics.add("anime-news");
  return [...topics].filter(Boolean);
}

export function parseCrunchyrollRss(xml: string): CrunchyrollRssItem[] {
  const items: CrunchyrollRssItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = extractTag(block, "title");
    const link = extractTag(block, "link");
    const guid = extractTag(block, "guid") || link;

    if (!title || !link || !guid) continue;

    items.push({
      title,
      description: extractTag(block, "description"),
      contentEncoded: extractTag(block, "content:encoded"),
      link,
      guid,
      pubDate: extractTag(block, "pubDate"),
      author: extractTag(block, "author") || null,
      category: extractTag(block, "category") || null,
      thumbnailUrl: extractMediaThumbnail(block),
    });
  }

  return items;
}

export async function fetchCrunchyrollNewsFeed(limit = 30): Promise<CrunchyrollRssItem[]> {
  const response = await fetch(CRUNCHYROLL_NEWS_RSS_URL, {
    headers: { Accept: "application/rss+xml, application/xml, text/xml" },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`Crunchyroll RSS fetch failed (${response.status})`);
  }

  const xml = await response.text();
  return parseCrunchyrollRss(xml).slice(0, limit);
}

export function parseRssPubDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }
  return parsed.toISOString();
}
