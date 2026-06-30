"use client";

import { BlogHeroSlider } from "@/components/blog/BlogHeroSlider";
import {
  BLOG_HERO_LIVE_CONTAINER_CLASS,
  BLOG_HERO_LIVE_FRAME_CLASS,
  BLOG_HERO_FRAME_CLASS,
  type BlogHeroDisplaySettings,
} from "@/lib/blog/heroSlides";
import { useLocale } from "@/providers/LocaleProvider";
import { useBlogHero } from "@/providers/BlogHeroProvider";

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
  const { t, dir, locale } = useLocale();
  const isArabic = locale === "ar";

  if (belowCover) {
    return (
      <div dir={dir} className="border-t border-zinc-800 bg-zinc-950 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display text-base font-bold leading-relaxed text-white sm:text-xl md:text-2xl">
            {t.blog.heroTagline}
          </p>
          <h1
            className={`mt-3 font-display font-extrabold leading-tight text-white sm:mt-4 ${
              isArabic
                ? "text-3xl sm:text-4xl md:text-5xl"
                : "text-2xl uppercase italic tracking-[0.06em] sm:text-3xl md:text-4xl lg:text-5xl"
            } [text-shadow:0_2px_24px_rgba(251,146,60,0.45)]`}
          >
            {articleTitle ?? t.blog.hubTitle}
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
    <div dir={dir} className="border-b border-zinc-800 bg-zinc-950 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-3xl text-center">
        {!compact ? (
          <p className="font-display text-sm font-bold text-white sm:text-lg">{t.blog.heroTagline}</p>
        ) : null}
        <h1
          className={`font-display font-extrabold leading-tight text-white ${
            compact
              ? "mt-1 text-xl sm:text-2xl"
              : `mt-2 sm:mt-3 ${
                  isArabic
                    ? "text-2xl sm:text-3xl md:text-4xl"
                    : "text-xl uppercase italic tracking-[0.06em] sm:text-2xl md:text-3xl"
                }`
          } [text-shadow:0_2px_20px_rgba(251,146,60,0.4)]`}
        >
          {articleTitle ?? t.blog.hubTitle}
        </h1>
      </div>
    </div>
  );
}

function HeroCarouselSection({
  display,
  showGuideText,
  articleTitle,
}: {
  display: BlogHeroDisplaySettings;
  showGuideText: boolean;
  articleTitle?: string;
}) {
  const { t } = useLocale();
  const { slides } = useBlogHero();
  const overlayOpacity = Math.min(80, Math.max(0, display.overlayOpacity)) / 100;

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

export function BlogHeroBanner({ compact = false, articleTitle }: BlogHeroBannerProps) {
  const { slides, display } = useBlogHero();
  const hasCustomSlides = !compact && display.carouselEnabled && slides.length > 0;
  const showGuideText = !compact && display.showTextOverlay;

  if (compact) {
    return <HeroGuideText compact articleTitle={articleTitle} />;
  }

  if (hasCustomSlides) {
    return (
      <HeroCarouselSection
        display={display}
        showGuideText={showGuideText}
        articleTitle={articleTitle}
      />
    );
  }

  if (showGuideText) {
    return <HeroGuideText compact={false} articleTitle={articleTitle} belowCover />;
  }

  return (
    <div className={BLOG_HERO_LIVE_CONTAINER_CLASS} aria-hidden>
      <div className={`${BLOG_HERO_FRAME_CLASS} border-y border-zinc-800 bg-zinc-950 sm:rounded-xl sm:border`} />
    </div>
  );
}
