"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { slideObjectPositionStyle, type BlogHeroSlide } from "@/lib/blog/heroSlides";
import { useLocale } from "@/providers/LocaleProvider";

type BlogHeroSliderProps = {
  slides: BlogHeroSlide[];
  autoPlaySeconds?: number;
  className?: string;
};

export function BlogHeroSlider({
  slides,
  autoPlaySeconds = 5,
  className = "",
}: BlogHeroSliderProps) {
  const { t } = useLocale();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const count = slides.length;
  const autoAdvanceMs = Math.min(15, Math.max(3, autoPlaySeconds)) * 1000;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      const next = ((index % count) + count) % count;
      setActiveIndex(next);
    },
    [count],
  );

  const goNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  useEffect(() => {
    setActiveIndex(0);
  }, [slides]);

  useEffect(() => {
    if (count <= 1 || paused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveIndex((current) => (current + 1) % count);
    }, autoAdvanceMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [autoAdvanceMs, count, paused, slides]);

  if (count === 0) {
    return null;
  }

  return (
    <div
      className={`absolute inset-0 z-0 ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label={t.blog.heroCarouselLabel}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={index !== activeIndex}
        >
          <Image
            src={slide.imageUrl}
            alt=""
            fill
            priority={index === 0}
            className="object-cover"
            style={{ objectPosition: slideObjectPositionStyle(slide) }}
            sizes="100vw"
          />
        </div>
      ))}

      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute start-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-lg text-white backdrop-blur-sm transition hover:border-orange-400/50 hover:bg-black/65 sm:start-5 sm:h-10 sm:w-10"
            aria-label={t.blog.heroPrev}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute end-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-lg text-white backdrop-blur-sm transition hover:border-orange-400/50 hover:bg-black/65 sm:end-5 sm:h-10 sm:w-10"
            aria-label={t.blog.heroNext}
          >
            ›
          </button>

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 sm:bottom-5">
            {slides.map((slide, index) => (
              <button
                key={`dot-${slide.id}`}
                type="button"
                onClick={() => goTo(index)}
                className={`h-2.5 w-2.5 rounded-full border transition ${
                  index === activeIndex
                    ? "scale-110 border-orange-300 bg-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.65)]"
                    : "border-white/50 bg-white/35 hover:bg-white/70"
                }`}
                aria-label={t.blog.heroGoToSlide.replace("{n}", String(index + 1))}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
