export const SITE_URL = "https://www.clashanime.com";

/** Public marketing and content pages safe for search indexing. */
export const PUBLIC_STATIC_PATHS = [
  "/",
  "/videos",
  "/community",
  "/music",
  "/exclusives",
  "/tracker",
  "/about",
  "/earn",
  "/contact",
  "/terms",
  "/privacy",
  "/cookies",
  "/disclaimer",
  "/eula",
  "/dmca",
  "/community-guidelines",
  "/report",
  "/blog",
  "/blog/anime-news",
] as const;

/** Paths that should never be crawled or listed in the sitemap. */
export const DISALLOWED_PATH_PREFIXES = [
  "/admin",
  "/api",
  "/auth",
  "/upload",
  "/settings",
  "/profile",
] as const;

export function absoluteSiteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, SITE_URL).toString();
}
