import type { MetadataRoute } from "next";
import { listPublishedAnimeNewsSlugs } from "@/lib/animeNews.server";
import { loadWatchNowCatalog } from "@/lib/animeNews/watchNow.server";
import { watchNowAnimePath } from "@/lib/animeNews/watchNowPaths";
import { getBlogSlugs } from "@/lib/blog/posts";
import { getStorySlugs } from "@/lib/storiesLibrary";
import { absoluteSiteUrl, PUBLIC_STATIC_PATHS } from "@/lib/siteSeo";

export const SITEMAP_REVALIDATE_SECONDS = 86_400;

function staticEntries(now: Date): MetadataRoute.Sitemap {
  const extras = ["/legal", "/blog/anime-news/watch-now"] as const;
  const paths = [...PUBLIC_STATIC_PATHS, ...extras];
  return paths.map((path) => ({
    url: absoluteSiteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" ? "hourly" : "daily",
    priority:
      path === "/"
        ? 1
        : path === "/stories" || path === "/tracker" || path === "/blog" || path === "/blog/anime-news/watch-now"
          ? 0.9
          : 0.6,
  }));
}

/**
 * Flat Clash Anime sitemap: hubs + Heroes Guide posts + stories + anime news + watch-now catalog.
 * Soft-fails individual sources so Google never gets an empty urlset.
 */
export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [...staticEntries(now)];
  const seen = new Set(entries.map((entry) => entry.url));

  const addEntry = (path: string, lastModified?: string | Date | null, priority = 0.5) => {
    const url = absoluteSiteUrl(path);
    if (seen.has(url)) return;
    seen.add(url);
    entries.push({
      url,
      lastModified: lastModified ? new Date(lastModified) : now,
      changeFrequency: "weekly",
      priority,
    });
  };

  try {
    for (const slug of getBlogSlugs()) {
      addEntry(`/blog/${slug}`, null, 0.75);
    }
  } catch {
    /* ignore */
  }

  try {
    for (const slug of getStorySlugs()) {
      addEntry(`/stories/${slug}`, null, 0.78);
    }
  } catch {
    /* ignore */
  }

  try {
    const newsSlugs = await listPublishedAnimeNewsSlugs(500);
    for (const slug of newsSlugs) {
      addEntry(`/blog/anime-news/${slug}`, null, 0.72);
    }
  } catch {
    /* ignore if anime news table is not migrated yet */
  }

  try {
    const catalog = await loadWatchNowCatalog();
    for (const entry of catalog) {
      const key = typeof entry?.key === "string" ? entry.key.trim() : "";
      if (!key) continue;
      addEntry(watchNowAnimePath(key), null, 0.8);
    }
  } catch {
    /* ignore catalog failures */
  }

  return entries;
}
