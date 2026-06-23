import type { MetadataRoute } from "next";
import { DISALLOWED_PATH_PREFIXES, SITE_URL } from "@/lib/siteSeo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...DISALLOWED_PATH_PREFIXES],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
