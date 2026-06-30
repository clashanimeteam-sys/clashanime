"use client";

import type { ReactNode } from "react";
import { BlogHeroSlideImage } from "@/components/blog/BlogHeroSlideImage";
import { BLOG_HERO_FRAME_CLASS, BLOG_HERO_IMAGE_SIZES, type BlogHeroSlide } from "@/lib/blog/heroSlides";

type BlogHeroSlideFrameProps = {
  slide: Pick<
    BlogHeroSlide,
    "imageUrl" | "focalX" | "focalY" | "objectPosition" | "rotation" | "zoom"
  >;
  priority?: boolean;
  sizes?: string;
  className?: string;
  children?: ReactNode;
};

export function BlogHeroSlideFrame({
  slide,
  priority = false,
  sizes = BLOG_HERO_IMAGE_SIZES,
  className = "",
  children,
}: BlogHeroSlideFrameProps) {
  return (
    <div className={`${BLOG_HERO_FRAME_CLASS} ${className}`.trim()}>
      <BlogHeroSlideImage slide={slide} priority={priority} sizes={sizes} />
      {children}
    </div>
  );
}
