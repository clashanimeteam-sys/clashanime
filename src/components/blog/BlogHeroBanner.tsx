"use client";

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
        compact ? "min-h-[200px]" : "min-h-[280px] sm:min-h-[340px]"
      }`}
      aria-label={t.blog.hubTitle}
    >
      {/* Panoramic layered background */}
      <div className="absolute inset-0 bg-zinc-950" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_50%,rgba(239,68,68,0.35),transparent_55%),radial-gradient(ellipse_70%_55%_at_85%_45%,rgba(59,130,246,0.28),transparent_50%),radial-gradient(ellipse_90%_70%_at_50%_100%,rgba(249,115,22,0.22),transparent_60%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.35)_0%,rgba(9,9,11,0.75)_55%,rgb(9,9,11)_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:48px_48px]"
        aria-hidden
      />

      {/* Side glow accents — anime arena feel */}
      <div className="pointer-events-none absolute -start-24 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-red-600/20 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -end-24 top-1/3 h-72 w-72 rounded-full bg-blue-600/15 blur-3xl" aria-hidden />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center justify-center px-4 py-10 text-center sm:px-6 sm:py-14">
        {!compact ? (
          <p className="max-w-3xl font-display text-xl font-bold leading-snug text-white sm:text-2xl md:text-3xl lg:text-4xl">
            {t.blog.heroTagline}
          </p>
        ) : null}

        <h1
          className={`font-display font-black uppercase italic tracking-[0.08em] text-white ${
            compact
              ? "mt-2 text-2xl sm:text-3xl"
              : "mt-5 bg-gradient-to-br from-white via-orange-100 to-orange-300 bg-clip-text text-transparent text-3xl sm:mt-6 sm:text-4xl md:text-5xl"
          }`}
        >
          {articleTitle ?? t.blog.hubTitle}
        </h1>

        {!compact ? (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
            {t.blog.hubSubtitle}
          </p>
        ) : null}

        {!compact ? (
          <p className="mt-6 inline-flex rounded-full border border-orange-500/30 bg-black/40 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-orange-200">
            {t.blog.hubBadge}
          </p>
        ) : null}
      </div>
    </section>
  );
}
