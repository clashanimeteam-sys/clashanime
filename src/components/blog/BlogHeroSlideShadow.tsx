"use client";

import { slideShadowOverlayBackground } from "@/lib/blog/heroSlides";

type BlogHeroSlideShadowProps = {
  shadowOpacity: number;
  className?: string;
};

export function BlogHeroSlideShadow({ shadowOpacity, className = "" }: BlogHeroSlideShadowProps) {
  const background = slideShadowOverlayBackground(shadowOpacity);
  if (!background) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-[1] ${className}`.trim()}
      style={{ background }}
      aria-hidden
    />
  );
}
