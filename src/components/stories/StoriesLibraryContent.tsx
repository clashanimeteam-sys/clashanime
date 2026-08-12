"use client";

import Image from "next/image";
import Link from "next/link";
import { PageBackLink } from "@/components/PageBackLink";
import { STORY_ARTICLES } from "@/lib/storiesLibrary";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";

const COPY = {
  en: {
    title: "Anime Stories & Tales — Original Essays",
    intro:
      "Original ClashAnime essays on storytelling craft, emotion, and culture. Text only — no episode streams and no manga scans.",
    read: "Read essay",
    minutes: "min read",
  },
  ar: {
    title: "قصص وحكايات الأنمي — مقالات أصلية",
    intro:
      "مقالات أصلية من ClashAnime عن حرفة السرد والعاطفة والثقافة. نص فقط — بلا بث حلقات وبلا مسح مانغا.",
    read: "اقرأ المقال",
    minutes: "دقيقة قراءة",
  },
  ja: {
    title: "アニメの物語 — オリジナルエッセイ",
    intro: "物語技法・感情・文化についてのClashAnimeオリジナル文章。本編配信やスキャンはありません。",
    read: "読む",
    minutes: "分で読める",
  },
} as const;

export function StoriesLibraryContent() {
  const { locale, formatDateTime } = useLocale();
  const copy = COPY[locale] ?? COPY.en;
  usePageTitle(copy.title);

  const articles = [...STORY_ARTICLES].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <PageBackLink href="/blog/anime-news" label={locale === "ar" ? "العودة للأخبار" : "Back to news"} />
      <h1 className="mt-6 text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
        {copy.title}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{copy.intro}</p>

      <div className="mt-8 space-y-4">
        {articles.map((article) => {
          const local = article.locales[locale] ?? article.locales.en;
          return (
            <article
              key={article.slug}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative aspect-[3/4] w-full shrink-0 bg-zinc-100 sm:aspect-auto sm:w-36 sm:self-stretch dark:bg-zinc-900">
                  <Image
                    src={article.coverImageUrl}
                    alt={article.coverAnimeTitle}
                    fill
                    sizes="(max-width: 640px) 100vw, 144px"
                    className="object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col p-5">
                  <p className="text-xs text-zinc-500">
                    {formatDateTime(article.publishedAt, { dateStyle: "medium" })} · {article.readingMinutes}{" "}
                    {copy.minutes}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-orange-600">
                    {article.coverAnimeTitle}
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">{local.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {local.excerpt}
                  </p>
                  <Link
                    href={`/stories/${article.slug}`}
                    className="mt-4 inline-flex w-fit rounded-full bg-orange-500 px-4 py-2 text-xs font-bold text-white"
                  >
                    {copy.read}
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
