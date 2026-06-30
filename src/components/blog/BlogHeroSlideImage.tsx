"use client";

import Image from "next/image";
import {
  isOptimizableHeroImageUrl,
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
  const objectPosition = slideObjectPositionStyle(slide);
  const useNextImage = isOptimizableHeroImageUrl(slide.imageUrl);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="relative h-full w-full origin-center" style={transformStyle}>
        {useNextImage ? (
          <Image
            src={slide.imageUrl}
            alt=""
            fill
            priority={priority}
            draggable={false}
            className={`${className} select-none`}
            style={{ objectPosition }}
            sizes={sizes}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={slide.imageUrl}
            alt=""
            draggable={false}
            className={`absolute inset-0 h-full w-full ${className} select-none`}
            style={{ objectPosition }}
          />
        )}
      </div>
    </div>
  );
}
