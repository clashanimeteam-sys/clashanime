"use client";

import Image from "next/image";
import { useLocale } from "@/providers/LocaleProvider";

type BlogHeroBannerProps = {
  compact?: boolean;
  articleTitle?: string;
};

export function BlogHeroBanner({ compact = false, articleTitle }: BlogHeroBannerProps) {
  const { t, dir } = useLocale();

  return (
    <section
      dir="ltr"
      className={`relative overflow-hidden border-b border-zinc-800 ${
        compact ? "min-h-[220px]" : "min-h-[360px] sm:min-h-[420px] lg:min-h-[440px]"
      }`}
      aria-label={t.blog.hubTitle}
    >
      <div className="absolute inset-0 bg-zinc-950" aria-hidden />

      {/* Center arena spotlight — keeps text lane clear of characters */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_38%_70%_at_50%_48%,rgba(18,18,22,0.97),rgba(9,9,11,0.85)_52%,rgba(9,9,11,1)_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_28%_50%_at_50%_50%,rgba(249,115,22,0.14),transparent_72%)]"
        aria-hidden
      />

      {/* Left — Demon Slayer */}
      <div
        className={`pointer-events-none absolute bottom-0 left-0 top-[6%] ${
          compact
            ? "w-[38%] max-w-[170px]"
            : "w-[min(38vw,560px)] max-w-[560px] lg:w-[min(34vw,580px)] lg:max-w-[580px]"
        }`}
        aria-hidden
      >
        <Image
          src="/blog/hero-demon-slayer-left.png"
          alt=""
          fill
          priority={!compact}
          className="origin-bottom-left object-contain object-bottom object-left scale-[1.02] sm:scale-105 lg:scale-[1.08]"
          sizes="(max-width: 640px) 38vw, 580px"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/15 via-transparent to-zinc-950/85" />
      </div>

      {/* Right — Solo Leveling */}
      <div
        className={`pointer-events-none absolute bottom-0 right-0 top-[6%] ${
          compact
            ? "w-[38%] max-w-[170px]"
            : "w-[min(38vw,560px)] max-w-[560px] lg:w-[min(34vw,580px)] lg:max-w-[580px]"
        }`}
        aria-hidden
      >
        <Image
          src="/blog/hero-solo-leveling-right.png"
          alt=""
          fill
          priority={!compact}
          className="origin-bottom-right object-contain object-bottom object-right scale-[1.02] sm:scale-105 lg:scale-[1.08]"
          sizes="(max-width: 640px) 38vw, 580px"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-zinc-950/15 via-transparent to-zinc-950/85" />
      </div>

      {/* Side vignettes + vertical depth */}
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,9,11,0.55)_0%,rgba(9,9,11,0.05)_20%,rgba(9,9,11,0.05)_80%,rgba(9,9,11,0.55)_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.45)_0%,transparent_30%,transparent_70%,rgba(9,9,11,0.92)_100%)]"
        aria-hidden
      />

      {!compact ? (
        <div
          className="pointer-events-none absolute left-1/2 top-[42%] h-28 w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-orange-500/35 to-transparent sm:top-1/2 sm:h-40"
          aria-hidden
        />
      ) : null}

      {/* Text column — fixed center lane between characters */}
      <div className="relative z-10 flex min-h-[inherit] items-center justify-center px-[max(1rem,14vw)] py-10 sm:px-[max(1.5rem,18vw)] sm:py-11 lg:px-[max(2rem,20vw)] lg:py-12">
        <div
          dir={dir}
          className={`w-full text-center ${
            compact ? "max-w-xl" : "max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl"
          }`}
        >
          <div
            className={`rounded-2xl border border-white/10 bg-black/45 px-5 py-7 shadow-[0_8px_40px_rgba(0,0,0,0.55)] backdrop-blur-md sm:px-8 sm:py-8 ${
              compact ? "py-5" : ""
            }`}
          >
            {!compact ? (
              <p className="font-display text-base font-bold leading-relaxed text-white sm:text-xl md:text-2xl lg:leading-snug">
                {t.blog.heroTagline}
              </p>
            ) : null}

            <h1
              className={`font-display font-black uppercase italic tracking-[0.06em] text-white ${
                compact
                  ? "mt-1 text-xl sm:text-2xl"
                  : "mt-3 bg-gradient-to-br from-white via-orange-100 to-amber-200 bg-clip-text text-transparent text-2xl sm:mt-4 sm:text-3xl md:text-4xl lg:text-5xl"
              }`}
            >
              {articleTitle ?? t.blog.hubTitle}
            </h1>

            {!compact ? (
              <p className="mx-auto mt-3 max-w-prose text-xs leading-relaxed text-zinc-300 sm:mt-4 sm:text-sm md:text-[0.9375rem]">
                {t.blog.hubSubtitle}
              </p>
            ) : null}

            {!compact ? (
              <p className="mt-5 inline-flex rounded-full border border-orange-500/35 bg-black/60 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-orange-200 sm:mt-6 sm:px-4 sm:py-1.5 sm:text-[11px]">
                {t.blog.hubBadge}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
