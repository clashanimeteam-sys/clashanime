"use client";

import { ContentGuidePage } from "@/components/ContentGuidePage";
import { getContentHubCopy, type ContentHubKey } from "@/lib/contentHubCopy";
import { useLocale } from "@/providers/LocaleProvider";

const RELATED = [
  { href: "/stories", labelKey: "stories" as const },
  { href: "/manga", labelKey: "manga" as const },
  { href: "/gallery", labelKey: "gallery" as const },
  { href: "/tracker", labelKey: "animeTracker" as const },
  { href: "/music", labelKey: "music" as const },
  { href: "/blog", labelKey: "heroesGuide" as const },
];

const LABELS = {
  en: {
    stories: "Stories",
    manga: "Manga",
    gallery: "Images",
    animeTracker: "Radar",
    music: "Anime Radio",
    heroesGuide: "Heroes Guide",
  },
  ar: {
    stories: "قصص",
    manga: "مانغا",
    gallery: "صور",
    animeTracker: "رادار",
    music: "راديو الأنمي",
    heroesGuide: "دليل الأبطال",
  },
  ja: {
    stories: "物語",
    manga: "マンガ",
    gallery: "画像",
    animeTracker: "レーダー",
    music: "アニメラジオ",
    heroesGuide: "ヒーローズガイド",
  },
} as const;

export function ContentHubPageContent({ hub }: { hub: ContentHubKey }) {
  const { locale, t } = useLocale();
  const copy = getContentHubCopy(hub, locale);
  const labels = LABELS[locale] ?? LABELS.en;

  return (
    <ContentGuidePage
      copy={copy}
      related={RELATED.filter((item) => item.href !== `/${hub}`).map((item) => ({
        href: item.href,
        label: labels[item.labelKey] ?? t.nav.music,
      }))}
    />
  );
}
