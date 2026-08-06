"use client";

import Image from "next/image";
import Link from "next/link";
import { PageBackLink } from "@/components/PageBackLink";
import type { CatalogCard } from "@/lib/jikanCatalog";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";

const COPY = {
  en: {
    back: "Back to anime news",
    noticeTitle: "Discovery catalog — not piracy",
    noticeBody:
      "Thumbnails and titles come from MyAnimeList (via Jikan) for identification only. Rights stay with creators and publishers. We do not host episodes or manga chapters. Use official/legal stores and apps to read or watch.",
    score: "Score",
    openMal: "Open on MyAnimeList",
    empty: "Catalog temporarily unavailable. Try again soon.",
  },
  ar: {
    back: "العودة لأخبار الأنمي",
    noticeTitle: "كتالوج اكتشاف — ليس قرصنة",
    noticeBody:
      "الصور المصغّرة والعناوين من MyAnimeList (عبر Jikan) للتعرّف فقط. الحقوق للمبدعين والناشرين. لا نستضيف حلقات أو فصول مانغا. للقراءة/المشاهدة استخدم المتاجر والتطبيقات الرسمية القانونية.",
    score: "التقييم",
    openMal: "فتح على MyAnimeList",
    empty: "الكتالوج غير متاح مؤقتاً. حاول لاحقاً.",
  },
  ja: {
    back: "アニメニュースへ戻る",
    noticeTitle: "発見カタログ — 海賊版ではありません",
    noticeBody:
      "サムネイルとタイトルは識別用に MyAnimeList（Jikan経由）から取得。権利は作者・出版社にあります。本編やマンガ全話は置きません。視聴・購読は公式サービスで。",
    score: "スコア",
    openMal: "MyAnimeListで開く",
    empty: "カタログを一時取得できません。後でもう一度。",
  },
} as const;

type LocalizedText = { en: string; ar: string; ja: string };

type DiscoveryCatalogProps = {
  title: LocalizedText;
  intro: LocalizedText;
  sections: Array<{ heading: LocalizedText; items: CatalogCard[] }>;
};

export function DiscoveryCatalog({ title, intro, sections }: DiscoveryCatalogProps) {
  const { locale } = useLocale();
  const copy = COPY[locale] ?? COPY.en;
  const pageTitle = title[locale] ?? title.en;
  usePageTitle(pageTitle);

  const hasAny = sections.some((section) => section.items.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <PageBackLink href="/blog/anime-news" label={copy.back} />
      <h1 className="mt-6 text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
        {pageTitle}
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
        {intro[locale] ?? intro.en}
      </p>

      <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-50/80 p-4 text-sm text-emerald-950 dark:border-emerald-500/20 dark:bg-emerald-950/30 dark:text-emerald-100">
        <p className="font-semibold">{copy.noticeTitle}</p>
        <p className="mt-1 leading-relaxed opacity-90">{copy.noticeBody}</p>
      </div>

      {!hasAny ? <p className="mt-10 text-sm text-zinc-500">{copy.empty}</p> : null}

      {sections.map((section) =>
        section.items.length === 0 ? null : (
          <section key={section.heading.en} className="mt-10">
            <h2 className="mb-4 text-lg font-bold text-zinc-900 dark:text-white">
              {section.heading[locale] ?? section.heading.en}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {section.items.map((item) => (
                <a
                  key={`${item.kind}-${item.id}`}
                  href={item.malUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-orange-400 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="relative aspect-[3/4] bg-zinc-100 dark:bg-zinc-900">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt=""
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 50vw, 180px"
                      />
                    ) : null}
                  </div>
                  <div className="space-y-1 p-3">
                    <p className="line-clamp-2 text-sm font-semibold text-zinc-900 dark:text-white">
                      {item.title}
                    </p>
                    {item.subtitle ? (
                      <p className="line-clamp-1 text-xs text-zinc-500">{item.subtitle}</p>
                    ) : null}
                    {item.score != null ? (
                      <p className="text-xs font-medium text-orange-600 dark:text-orange-300">
                        {copy.score}: {item.score.toFixed(1)}
                      </p>
                    ) : null}
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                      {copy.openMal}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        ),
      )}

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/blog/anime-news"
          className="rounded-full bg-orange-500 px-4 py-2 text-xs font-bold text-white"
        >
          {copy.back}
        </Link>
        <Link
          href="/tracker"
          className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold dark:border-zinc-700"
        >
          Radar
        </Link>
        <Link
          href="/music"
          className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold dark:border-zinc-700"
        >
          Radio
        </Link>
      </div>
    </div>
  );
}
