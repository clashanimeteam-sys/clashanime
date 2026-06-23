import { AdminAnimeTrackerPanel } from "@/components/admin/AdminAnimeTrackerPanel";
import { getAnimeSeoCatalog } from "@/lib/animeTracker.server";
import { buildSeoKeywords } from "@/lib/seoMetadata";

export const dynamic = "force-dynamic";

export default async function AdminAnimeTrackerPage() {
  const catalog = await getAnimeSeoCatalog();
  const seoKeywordCount = buildSeoKeywords([], catalog).length;

  return (
    <AdminAnimeTrackerPanel seoAnimeCount={catalog.length} seoKeywordCount={seoKeywordCount} />
  );
}
