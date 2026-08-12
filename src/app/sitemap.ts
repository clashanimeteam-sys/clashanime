import type { MetadataRoute } from "next";
import { buildSitemapEntries, SITEMAP_REVALIDATE_SECONDS } from "@/lib/sitemapUrls";

export const revalidate = SITEMAP_REVALIDATE_SECONDS;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const entries = await buildSitemapEntries();
    return entries.length > 0
      ? entries
      : [
          {
            url: "https://www.clashanime.com/",
            lastModified: new Date(),
            changeFrequency: "hourly",
            priority: 1,
          },
        ];
  } catch {
    return [
      {
        url: "https://www.clashanime.com/",
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 1,
      },
    ];
  }
}
