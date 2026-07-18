"use client";

import Link from "next/link";
import { useLocale } from "@/providers/LocaleProvider";

const COPY = {
  en: {
    title: "What is ClashAnime?",
    body: "ClashAnime is a competitive anime community where creators upload short duel clips, join timed episode clashes, climb hunter ranks, and grow with a global fanbase. Public leaderboards, written rules, and reward programs (ClashCoins) make the arena transparent. Explore how it works, read the FAQ, and learn from the Heroes Guide before your first upload.",
    how: "How it works",
    faq: "FAQ",
    guide: "Heroes Guide",
    about: "About us",
  },
  ar: {
    title: "ما هو ClashAnime؟",
    body: "ClashAnime مجتمع أنمي تنافسي: ترفع لقطات نزال قصيرة، تدخل نزالات حلقات مؤقتة، تصعد رتب الصياد، وتنمو مع جمهور عالمي. لوحات ترتيب عامة وقواعد مكتوبة وبرامج مكافآت (ClashCoins) تجعل الساحة شفافة. تعرّف كيف يعمل الموقع، اقرأ الأسئلة الشائعة، وتعلّم من دليل الأبطال قبل أول رفع.",
    how: "كيف يعمل",
    faq: "الأسئلة الشائعة",
    guide: "دليل الأبطال",
    about: "معلومات عنا",
  },
  ja: {
    title: "ClashAnimeとは？",
    body: "ClashAnimeは競争型アニメコミュニティです。短いデュエルクリップ、時間制限クラッシュ、ハンターランク、グローバルなファン成長。公開ランキングとルールとClashCoinsで透明なアリーナを目指します。初めての投稿前に仕組み・FAQ・ヒーローズガイドを確認してください。",
    how: "仕組み",
    faq: "FAQ",
    guide: "ヒーローズガイド",
    about: "私たちについて",
  },
} as const;

export function HomeEditorial() {
  const { locale } = useLocale();
  const copy = COPY[locale] ?? COPY.en;

  return (
    <section
      aria-labelledby="home-editorial-title"
      className="mx-auto mt-10 max-w-4xl rounded-2xl border border-zinc-200 bg-zinc-50/90 p-5 dark:border-zinc-800 dark:bg-zinc-950/70 sm:p-7"
    >
      <h2 id="home-editorial-title" className="text-xl font-bold text-zinc-900 dark:text-white">
        {copy.title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{copy.body}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href="/how-it-works"
          className="rounded-full bg-orange-500 px-4 py-2 text-xs font-bold text-white hover:bg-orange-400"
        >
          {copy.how}
        </Link>
        <Link
          href="/faq"
          className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
        >
          {copy.faq}
        </Link>
        <Link
          href="/blog"
          className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
        >
          {copy.guide}
        </Link>
        <Link
          href="/about"
          className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
        >
          {copy.about}
        </Link>
      </div>
    </section>
  );
}
