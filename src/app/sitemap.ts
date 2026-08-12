import type { MetadataRoute } from "next";
import { buildSitemapEntries } from "@/lib/sitemapUrls";

/** Must be a numeric literal for Next.js segment config. */
export const revalidate = 86400;

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
