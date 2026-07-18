"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
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
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    const play = () => {
      void video.play().catch(() => {
        /* autoplay can still fail on some browsers */
      });
    };
    play();
    video.addEventListener("canplay", play);
    return () => video.removeEventListener("canplay", play);
  }, []);

  return (
    <div className="relative flex h-full min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden px-6 py-16 text-center md:min-h-0">
      <video
        ref={videoRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
        src="/animevideo.mp4"
        poster="/animevideo-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-b from-black/45 via-black/35 to-black/55"
        aria-hidden
      />

      <div className="relative z-10 flex flex-col items-center">
        <span className="rounded-full bg-orange-500/25 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-orange-50 ring-1 ring-orange-300/50 backdrop-blur-sm">
          {copy.badge}
        </span>
        <h1 className="mt-6 max-w-xl text-3xl font-black tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] sm:text-4xl">
          {copy.title}
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-zinc-100 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)] sm:text-base">
          {copy.body}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-900/40"
          >
            {copy.ctaHome}
          </Link>
          <Link
            href="/blog"
            className="rounded-full border border-white/30 bg-black/50 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-black/65"
          >
            {copy.ctaBlog}
          </Link>
        </div>
      </div>
    </div>
  );
}
