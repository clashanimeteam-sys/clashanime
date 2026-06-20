"use client";

import Image from "next/image";

type AnimeRadioArtworkProps = {
  src: string;
  alt: string;
  isPlaying: boolean;
  accentFrom: string;
  accentTo: string;
  size?: "default" | "mini";
};

const SIZE_CLASSES = {
  default: {
    outer: "h-52 w-52 sm:h-60 sm:w-60",
    ring: "inset-3",
    label: "inset-6 border-2",
    hole: "h-4 w-4",
    imageSizes: "(max-width: 640px) 208px, 240px",
    glow: "blur-2xl",
  },
  mini: {
    outer: "h-11 w-11 sm:h-12 sm:w-12",
    ring: "inset-[3px]",
    label: "inset-[5px] border",
    hole: "h-1.5 w-1.5",
    imageSizes: "48px",
    glow: "blur-md",
  },
} as const;

export function AnimeRadioArtwork({
  src,
  alt,
  isPlaying,
  accentFrom,
  accentTo,
  size = "default",
}: AnimeRadioArtworkProps) {
  const dimensions = SIZE_CLASSES[size];

  return (
    <div className={`relative shrink-0 ${dimensions.outer} ${size === "default" ? "mx-auto" : ""}`}>
      <div
        className={`absolute inset-0 rounded-full ${dimensions.glow} ${isPlaying ? "animate-[radio-glow_2.4s_ease-in-out_infinite]" : "opacity-40"}`}
        style={{
          background: `linear-gradient(135deg, ${accentFrom}88, ${accentTo}66)`,
        }}
      />

      <div
        className={`absolute ${dimensions.ring} rounded-full border border-white/10 ${isPlaying ? "animate-[vinyl-spin_14s_linear_infinite]" : ""}`}
        style={{
          background: `conic-gradient(from 180deg, ${accentFrom}, ${accentTo}, ${accentFrom})`,
        }}
      />

      <div
        className={`absolute ${dimensions.label} overflow-hidden rounded-full border-white/20 shadow-lg shadow-black/40`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover transition-transform duration-700 ${isPlaying ? "scale-105" : "scale-100"}`}
          sizes={dimensions.imageSizes}
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10" />
      </div>

      <div
        className={`absolute left-1/2 top-1/2 ${dimensions.hole} -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/80 shadow-inner`}
      />
    </div>
  );
}
