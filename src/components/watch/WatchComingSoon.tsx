"use client";

import Link from "next/link";
import { useLocale } from "@/providers/LocaleProvider";

const COPY = {
  en: {
    badge: "Coming soon",
    title: "Watch Anime is coming soon",
    body: "We’re preparing a member watch experience. Meanwhile, join clashes, upload clips, and climb the hunter ranks on ClashAnime.",
    ctaHome: "Back to arena",
    ctaBlog: "Heroes Guide",
  },
  ar: {
    badge: "قريباً",
    title: "شاهد الأنمي قريباً",
    body: "نجهّز تجربة مشاهدة للأعضاء. حالياً نافس في النزالات، ارفع مقاطعك، واصعد رتب الصياد على ClashAnime.",
    ctaHome: "العودة للساحة",
    ctaBlog: "دليل الأبطال",
  },
  ja: {
    badge: "近日公開",
    title: "アニメ視聴は近日公開",
    body: "会員向け視聴体験を準備中です。今はクラッシュに参加し、クリップを投稿してハンターランクを上げましょう。",
    ctaHome: "アリーナへ戻る",
    ctaBlog: "ヒーローズガイド",
  },
} as const;

export function WatchComingSoon() {
  const { locale } = useLocale();
  const copy = COPY[locale] ?? COPY.en;

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center">
      <span className="rounded-full bg-orange-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-orange-200 ring-1 ring-orange-500/30">
        {copy.badge}
      </span>
      <h1 className="mt-6 max-w-xl text-3xl font-black tracking-tight text-white sm:text-4xl">
        {copy.title}
      </h1>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-zinc-400 sm:text-base">{copy.body}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-900/30"
        >
          {copy.ctaHome}
        </Link>
        <Link
          href="/blog"
          className="rounded-full border border-zinc-600 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800"
        >
          {copy.ctaBlog}
        </Link>
      </div>
    </div>
  );
}
