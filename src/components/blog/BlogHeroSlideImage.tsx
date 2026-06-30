"use client";

import Image from "next/image";
import {
  isOptimizableHeroImageUrl,
  parseRotation,
  parseZoom,
  slideImageTransformStyle,
  slideObjectPositionStyle,
  type BlogHeroSlide,
} from "@/lib/blog/heroSlides";

type BlogHeroSlideImageProps = {
  slide: Pick<
    BlogHeroSlide,
    "imageUrl" | "focalX" | "focalY" | "objectPosition" | "rotation" | "zoom"
  >;
  priority?: boolean;
  sizes: string;
  quality?: number;
  unoptimized?: boolean;
  className?: string;
};

export function BlogHeroSlideImage({
  slide,
  priority = false,
  sizes,
  quality,
  unoptimized = false,
  className = "object-cover",
}: BlogHeroSlideImageProps) {
  const rotation = parseRotation(slide.rotation);
  const zoom = parseZoom(slide.zoom);
  const transformStyle = slideImageTransformStyle(rotation, zoom);
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
            quality={quality}
            unoptimized={unoptimized}
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
