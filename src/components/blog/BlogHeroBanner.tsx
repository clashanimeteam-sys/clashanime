"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { BlogHeroSlider } from "@/components/blog/BlogHeroSlider";
import {
  BLOG_HERO_LIVE_CONTAINER_CLASS,
  BLOG_HERO_LIVE_FRAME_CLASS,
  DEFAULT_BLOG_HERO_DISPLAY,
  type BlogHeroDisplaySettings,
  type BlogHeroSlide,
} from "@/lib/blog/heroSlides";
import { useLocale } from "@/providers/LocaleProvider";

type BlogHeroBannerProps = {
  compact?: boolean;
  articleTitle?: string;
};

function HeroGuideText({
  compact,
  articleTitle,
  belowCover = false,
}: {
  compact: boolean;
  articleTitle?: string;
  belowCover?: boolean;
}) {
  const { t, dir } = useLocale();

  if (belowCover) {
    return (
      <div dir={dir} className="border-t border-zinc-800 bg-zinc-950 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display text-base font-bold leading-relaxed text-white sm:text-xl md:text-2xl">
            {t.blog.heroTagline}
          </p>
          <h1 className="mt-3 font-display text-2xl font-black uppercase italic tracking-[0.06em] text-white sm:mt-4 sm:text-3xl md:text-4xl lg:text-5xl">
            <span className="bg-gradient-to-br from-white via-orange-100 to-amber-200 bg-clip-text text-transparent">
              {articleTitle ?? t.blog.hubTitle}
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-prose text-sm leading-relaxed text-zinc-300 sm:mt-4 md:text-base">
            {t.blog.hubSubtitle}
          </p>
          <a
            href="#user-guide"
            className="mt-6 inline-flex rounded-full border border-orange-500/35 bg-orange-950/20 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-orange-200 transition hover:border-orange-400/55 hover:bg-orange-500/10 hover:text-orange-100 sm:text-xs"
          >
            {t.blog.hubBadge}
          </a>
        </div>
      </div>
    );
  }

  return (
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
            <a
              href="#user-guide"
              className="mt-5 inline-flex rounded-full border border-orange-500/35 bg-black/60 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-orange-200 transition hover:border-orange-400/55 hover:bg-orange-500/10 hover:text-orange-100 sm:mt-6 sm:px-4 sm:py-2 sm:text-[11px]"
            >
              {t.blog.hubBadge}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function BlogHeroBanner({ compact = false, articleTitle }: BlogHeroBannerProps) {
  const { t } = useLocale();
  const [slides, setSlides] = useState<BlogHeroSlide[]>([]);
  const [display, setDisplay] = useState<BlogHeroDisplaySettings>(DEFAULT_BLOG_HERO_DISPLAY);
  const [slidesLoaded, setSlidesLoaded] = useState(false);

  useEffect(() => {
    if (compact) {
      setSlidesLoaded(true);
      return;
    }

    let cancelled = false;

    void fetch("/api/blog/hero-slides", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload: { slides?: BlogHeroSlide[]; display?: BlogHeroDisplaySettings }) => {
        if (!cancelled) {
          setSlides(payload.slides ?? []);
          setDisplay(payload.display ?? DEFAULT_BLOG_HERO_DISPLAY);
          setSlidesLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSlides([]);
          setDisplay(DEFAULT_BLOG_HERO_DISPLAY);
          setSlidesLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [compact]);

  const hasCustomSlides = !compact && display.carouselEnabled && slides.length > 0;
  const showGuideText = !compact && display.showTextOverlay;
  const overlayOpacity = Math.min(80, Math.max(0, display.overlayOpacity)) / 100;

  if (hasCustomSlides) {
    return (
      <section className="border-b border-zinc-800" aria-label={t.blog.hubTitle}>
        <div className={BLOG_HERO_LIVE_CONTAINER_CLASS}>
          <div className={BLOG_HERO_LIVE_FRAME_CLASS}>
            <BlogHeroSlider slides={slides} autoPlaySeconds={display.autoPlaySeconds} />

            {overlayOpacity > 0 ? (
              <div
                className="pointer-events-none absolute inset-0 z-[1] rounded-xl"
                style={{
                  background: `linear-gradient(180deg, rgba(9,9,11,${overlayOpacity * 0.15}) 0%, transparent 35%, transparent 65%, rgba(9,9,11,${overlayOpacity * 0.55}) 100%)`,
                }}
                aria-hidden
              />
            ) : (
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-16 rounded-b-xl bg-gradient-to-t from-zinc-950/50 to-transparent"
                aria-hidden
              />
            )}
          </div>
        </div>

        {showGuideText ? (
          <HeroGuideText compact={false} articleTitle={articleTitle} belowCover />
        ) : null}
      </section>
    );
  }

  return (
    <section
      dir="ltr"
      className={`relative overflow-hidden border-b border-zinc-800 ${
        compact ? "min-h-[220px]" : "min-h-[360px] sm:min-h-[420px] lg:min-h-[440px]"
      }`}
      aria-label={t.blog.hubTitle}
    >
      <div className="absolute inset-0 bg-zinc-950" aria-hidden />

      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_38%_70%_at_50%_48%,rgba(18,18,22,0.97),rgba(9,9,11,0.85)_52%,rgba(9,9,11,1)_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_28%_50%_at_50%_50%,rgba(249,115,22,0.14),transparent_72%)]"
        aria-hidden
      />

      <div
        className={`pointer-events-none absolute bottom-0 left-0 top-0 overflow-hidden ${
          compact
            ? "w-[44%] max-w-[200px]"
            : "w-[min(46vw,680px)] max-w-[680px] lg:w-[min(42vw,720px)] lg:max-w-[720px]"
        }`}
        aria-hidden
      >
        <div className="relative h-full w-[132%]">
          <Image
            src="/blog/hero-demon-slayer-left.png"
            alt=""
            fill
            priority={!compact}
            className="object-cover object-left object-bottom scale-[1.06] sm:scale-[1.1] lg:scale-[1.14]"
            sizes="(max-width: 640px) 46vw, 720px"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-zinc-950/80" />
      </div>

      <div
        className={`pointer-events-none absolute bottom-0 right-0 top-0 overflow-hidden ${
          compact
            ? "w-[44%] max-w-[200px]"
            : "w-[min(46vw,680px)] max-w-[680px] lg:w-[min(42vw,720px)] lg:max-w-[720px]"
        }`}
        aria-hidden
      >
        <div className="relative ms-auto h-full w-[132%]">
          <Image
            src="/blog/hero-solo-leveling-right.png"
            alt=""
            fill
            priority={!compact}
            className="object-cover object-right object-bottom scale-[1.06] sm:scale-[1.1] lg:scale-[1.14]"
            sizes="(max-width: 640px) 46vw, 720px"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-zinc-950/80" />
      </div>

      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,9,11,0.55)_0%,rgba(9,9,11,0.05)_20%,rgba(9,9,11,0.05)_80%,rgba(9,9,11,0.55)_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.45)_0%,transparent_30%,transparent_70%,rgba(9,9,11,0.92)_100%)]"
        aria-hidden
      />

      {!compact && slidesLoaded ? (
        <div
          className="pointer-events-none absolute left-1/2 top-[42%] h-28 w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-orange-500/35 to-transparent sm:top-1/2 sm:h-40"
          aria-hidden
        />
      ) : null}

      {showGuideText || compact ? (
        <HeroGuideText compact={compact} articleTitle={articleTitle} />
      ) : null}
    </section>
  );
}
