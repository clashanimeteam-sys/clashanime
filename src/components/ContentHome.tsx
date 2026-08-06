"use client";

import Link from "next/link";
import { useLocale } from "@/providers/LocaleProvider";

const COPY = {
  en: {
    badge: "Copyright-safe hub",
    title: "Stories, Manga, Images, Radar & Radio",
    body: "ClashAnime is now a reading and culture site: original stories and essays, manga notes, visual moodboards, anime release radar, anime radio, and the Heroes Guide. No login wall, no channels, no episode streaming, and no cash contests — so we stay focused on legal, text-first fandom.",
    cards: [
      { href: "/stories", title: "Stories & Tales", desc: "Original essays and narrative commentary." },
      { href: "/manga", title: "Manga Notes", desc: "Panels, pacing, and reading craft." },
      { href: "/gallery", title: "Images", desc: "Atmosphere moodboards and visual tips." },
      { href: "/tracker", title: "Anime Radar", desc: "Release calendars and season heat." },
      { href: "/music", title: "Anime Radio", desc: "Soundtrack ambience and beats lounge." },
      { href: "/blog", title: "Heroes Guide", desc: "Editorial guides and anime news." },
    ],
  },
  ar: {
    badge: "مركز آمن لحقوق النشر",
    title: "قصص ومانغا وصور ورادار وراديو",
    body: "ClashAnime أصبح موقعاً للقراءة والثقافة: قصص ومقالات أصلية، ملاحظات مانغا، معرض صور، رادار الإصدارات، راديو الأنمي، ودليل الأبطال. بلا تسجيل دخول، بلا قنوات، بلا بث حلقات، بلا مسابقات ربح — نركز على محتوى قانوني نصّي.",
    cards: [
      { href: "/stories", title: "قصص وحكايات", desc: "مقالات أصلية وتعليق سردي." },
      { href: "/manga", title: "مانغا", desc: "لوحات وإيقاع وحرفة القراءة." },
      { href: "/gallery", title: "صور", desc: "أجواء ونصائح بصرية." },
      { href: "/tracker", title: "رادار الأنمي", desc: "تقويم الإصدارات وحرارة الموسم." },
      { href: "/music", title: "راديو الأنمي", desc: "أجواء صوتية وصالة إيقاعات." },
      { href: "/blog", title: "دليل الأبطال", desc: "أدلة تحريرية وأخبار الأنمي." },
    ],
  },
  ja: {
    badge: "著作権に配慮したハブ",
    title: "物語・マンガ・画像・レーダー・ラジオ",
    body: "ClashAnimeは読書とカルチャーのサイトです。オリジナル物語、マンガノート、ムードボード、放送レーダー、アニメラジオ、ヒーローズガイド。ログイン必須なし、チャンネルなし、本編配信なし、賞金コンテストなし。",
    cards: [
      { href: "/stories", title: "物語", desc: "オリジナルエッセイと物語解説。" },
      { href: "/manga", title: "マンガ", desc: "コマ・テンポ・読みの技法。" },
      { href: "/gallery", title: "画像", desc: "雰囲気ムードボード。" },
      { href: "/tracker", title: "アニメレーダー", desc: "放送カレンダー。" },
      { href: "/music", title: "アニメラジオ", desc: "サウンドトラック空間。" },
      { href: "/blog", title: "ヒーローズガイド", desc: "編集ガイドとニュース。" },
    ],
  },
} as const;

export function ContentHome() {
  const { locale } = useLocale();
  const copy = COPY[locale] ?? COPY.en;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <span className="inline-flex rounded-full bg-orange-500/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-orange-700 dark:text-orange-300">
        {copy.badge}
      </span>
      <h1 className="mt-4 max-w-3xl text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
        {copy.title}
      </h1>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-base">
        {copy.body}
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {copy.cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 transition hover:border-orange-400 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-orange-500"
          >
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{card.title}</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
