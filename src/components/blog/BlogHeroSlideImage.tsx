"use client";

import Image from "next/image";
import {
  parseRotation,
  slideImageTransformStyle,
  slideObjectPositionStyle,
  type BlogHeroSlide,
} from "@/lib/blog/heroSlides";

type BlogHeroSlideImageProps = {
  slide: Pick<BlogHeroSlide, "imageUrl" | "focalX" | "focalY" | "objectPosition" | "rotation">;
  priority?: boolean;
  sizes: string;
  className?: string;
};

export function BlogHeroSlideImage({
  slide,
  priority = false,
  sizes,
  className = "object-cover",
}: BlogHeroSlideImageProps) {
  const rotation = parseRotation(slide.rotation);
  const transformStyle = slideImageTransformStyle(rotation);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="relative h-full w-full origin-center" style={transformStyle}>
        <Image
          src={slide.imageUrl}
          alt=""
          fill
          priority={priority}
          draggable={false}
          className={`${className} select-none`}
          style={{ objectPosition: slideObjectPositionStyle(slide) }}
          sizes={sizes}
        />
      </div>
    </div>
  );
}
