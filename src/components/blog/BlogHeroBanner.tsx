"use client";

import Image from "next/image";
import { useLocale } from "@/providers/LocaleProvider";

type BlogHeroBannerProps = {
  compact?: boolean;
  articleTitle?: string;
};

export function BlogHeroBanner({ compact = false, articleTitle }: BlogHeroBannerProps) {
  const { t } = useLocale();

  return (
    <section
      className={`relative overflow-hidden border-b border-zinc-800 ${
        compact ? "min-h-[220px]" : "min-h-[320px] sm:min-h-[400px] lg:min-h-[440px]"
      }`}
      aria-label={t.blog.hubTitle}
    >
      {/* Dark arena base */}
      <div className="absolute inset-0 bg-zinc-950" aria-hidden />

      {/* Center atmospheric glow — confrontation arena */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_55%_80%_at_50%_45%,rgba(30,30,35,0.9),rgba(9,9,11,1)_70%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_50%_50%,rgba(249,115,22,0.12),transparent_70%)]"
        aria-hidden
      />

      {/* Left — Demon Slayer */}
      <div
        className={`pointer-events-none absolute bottom-0 start-0 ${
          compact ? "h-[85%] w-[42%] max-w-[200px]" : "h-[92%] w-[38%] max-w-[320px] sm:max-w-[380px] lg:max-w-[440px]"
        }`}
        aria-hidden
      >
        <Image
          src="/blog/hero-demon-slayer-left.png"
          alt=""
          fill
          priority={!compact}
          className="object-contain object-bottom"
          sizes="(max-width: 640px) 42vw, 440px"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-zinc-950/90" />
      </div>

      {/* Right — Solo Leveling */}
      <div
        className={`pointer-events-none absolute bottom-0 end-0 ${
          compact ? "h-[85%] w-[42%] max-w-[200px]" : "h-[92%] w-[38%] max-w-[320px] sm:max-w-[380px] lg:max-w-[440px]"
        }`}
        aria-hidden
      >
        <Image
          src="/blog/hero-solo-leveling-right.png"
          alt=""
          fill
          priority={!compact}
          className="object-contain object-bottom"
          sizes="(max-width: 640px) 42vw, 440px"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-zinc-950/90" />
      </div>

      {/* Top/bottom vignette for readability */}
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.55)_0%,rgba(9,9,11,0.15)_35%,rgba(9,9,11,0.2)_65%,rgba(9,9,11,0.95)_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,9,11,0.35)_0%,transparent_22%,transparent_78%,rgba(9,9,11,0.35)_100%)]"
        aria-hidden
      />

      {/* VS energy line */}
      {!compact ? (
        <div
          className="pointer-events-none absolute start-1/2 top-1/2 h-32 w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-orange-500/40 to-transparent sm:h-48"
          aria-hidden
        />
      ) : null}

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-10 text-center sm:px-6 sm:py-14 lg:py-16">
        {!compact ? (
          <p className="max-w-2xl font-display text-lg font-bold leading-snug text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:text-2xl md:text-3xl lg:text-4xl">
            {t.blog.heroTagline}
          </p>
        ) : null}

        <h1
          className={`font-display font-black uppercase italic tracking-[0.08em] drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)] ${
            compact
              ? "mt-2 text-2xl text-white sm:text-3xl"
              : "mt-4 bg-gradient-to-br from-white via-orange-100 to-orange-300 bg-clip-text text-transparent text-3xl sm:mt-5 sm:text-4xl md:text-5xl lg:text-6xl"
          }`}
        >
          {articleTitle ?? t.blog.hubTitle}
        </h1>

        {!compact ? (
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-200 drop-shadow-md sm:text-base">
            {t.blog.hubSubtitle}
          </p>
        ) : null}

        {!compact ? (
          <p className="mt-6 inline-flex rounded-full border border-orange-500/40 bg-black/50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-orange-200 backdrop-blur-sm">
            {t.blog.hubBadge}
          </p>
        ) : null}
      </div>
    </section>
  );
}
