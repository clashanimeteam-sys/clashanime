"use client";

import Image from "next/image";
import {
  slideImageTransformStyle,
  slideObjectPositionStyle,
  type BlogHeroRotation,
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
  const rotation = slide.rotation ?? 0;
  const transformStyle = slideImageTransformStyle(rotation);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 origin-center"
        style={transformStyle.transform ? transformStyle : undefined}
      >
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
