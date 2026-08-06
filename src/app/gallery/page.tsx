import type { Metadata } from "next";
import { DiscoveryCatalog } from "@/components/discovery/DiscoveryCatalog";
import { fetchTopAnimeCatalog, fetchTopCharactersCatalog } from "@/lib/jikanCatalog";
import { buildPageMetadata } from "@/lib/seoMetadata";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata("gallery");

export default async function GalleryPage() {
  const [anime, characters] = await Promise.all([
    fetchTopAnimeCatalog(24),
    fetchTopCharactersCatalog(24),
  ]);

  return (
    <DiscoveryCatalog
      title={{
        en: "Image Gallery — Popular Anime & Characters",
        ar: "معرض الصور — أنمي وشخصيات شهيرة",
        ja: "画像ギャラリー — 人気アニメとキャラ",
      }}
      intro={{
        en: "Popular anime posters and famous characters for discovery. Identification thumbnails only — no episode streams and no stolen art packs.",
        ar: "ملصقات أنمي شهيرة وشخصيات معروفة للاكتشاف. صور تعرّف فقط — بلا بث حلقات وبلا حزم فن مسروق.",
        ja: "人気アニメのポスターと有名キャラの発見カタログ。識別用サムネのみ。本編配信や盗用素材はありません。",
      }}
      sections={[
        {
          heading: { en: "Popular anime", ar: "أنميات شهيرة", ja: "人気アニメ" },
          items: anime,
        },
        {
          heading: { en: "Famous characters", ar: "شخصيات شهيرة", ja: "有名キャラ" },
          items: characters,
        },
      ]}
    />
  );
}
