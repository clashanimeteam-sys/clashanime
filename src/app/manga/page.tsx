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
        en: "Browse popular manga titles, then open the matching anime on Watch Clash Anime.",
        ar: "تصفّح عناوين مانغا شهيرة، ثم افتح الأنمي المطابق على Watch Clash Anime.",
        ja: "人気マンガを一覧し、対応アニメを Watch Clash Anime で開きます。",
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
