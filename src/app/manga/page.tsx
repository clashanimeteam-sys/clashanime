import type { Metadata } from "next";
import { DiscoveryCatalog } from "@/components/discovery/DiscoveryCatalog";
import { fetchTopMangaCatalog } from "@/lib/jikanCatalog";
import { buildPageMetadata } from "@/lib/seoMetadata";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata("manga");

export default async function MangaPage() {
  const manga = await fetchTopMangaCatalog(25);

  return (
    <DiscoveryCatalog
      title={{
        en: "Manga Catalog — Discover Popular Titles",
        ar: "كتالوج المانغا — أشهر العناوين",
        ja: "マンガカタログ — 人気作品を発見",
      }}
      intro={{
        en: "Browse popular manga covers and titles for discovery. We do not host chapters or scans — open MyAnimeList for official reading options.",
        ar: "تصفّح أغلفة وعناوين مانغا شهيرة للاكتشاف. لا نستضيف فصولاً أو مسوحات — افتح MyAnimeList لخيارات القراءة الرسمية.",
        ja: "人気マンガの表紙とタイトルを発見。話のスキャンや全話配信は置きません。公式購読はMyAnimeListから。",
      }}
      sections={[
        {
          heading: { en: "Top manga", ar: "أشهر المانغا", ja: "人気マンガ" },
          items: manga,
        },
      ]}
    />
  );
}
