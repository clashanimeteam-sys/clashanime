import type { MetadataRoute } from "next";
import { listPublishedAnimeNewsSlugs } from "@/lib/animeNews.server";
import { getBlogSlugs } from "@/lib/blog/posts";
import { absoluteSiteUrl, PUBLIC_STATIC_PATHS } from "@/lib/siteSeo";

function staticEntries(now: Date): MetadataRoute.Sitemap {
  return PUBLIC_STATIC_PATHS.map((path) => ({
    url: absoluteSiteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" ? "hourly" : "daily",
    priority: path === "/" ? 1 : path === "/stories" || path === "/tracker" || path === "/blog" ? 0.9 : 0.6,
  }));
}

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

  for (const slug of getBlogSlugs()) {
    addEntry(`/blog/${slug}`, null, 0.7);
  }

  try {
    const newsSlugs = await listPublishedAnimeNewsSlugs(100);
    for (const slug of newsSlugs) {
      addEntry(`/blog/anime-news/${slug}`, null, 0.72);
    }
  } catch {
    // Ignore if anime news table is not migrated yet.
  }

  return entries;
}
