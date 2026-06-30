import { getFeaturedAnimeCatalog, parseFeaturedAnimeCatalog } from "@/lib/animeNews/featuredAnimeEnrich";
import { getStoredAnimeSpotlightCatalog } from "@/lib/animeNews.server";

export async function loadWatchNowCatalog() {
  const storedRaw = await getStoredAnimeSpotlightCatalog();
  const stored = parseFeaturedAnimeCatalog(storedRaw);
  return getFeaturedAnimeCatalog(stored);
}
