"use client";

import Image from "next/image";

type AnimeRadioArtworkProps = {
  src: string;
  alt: string;
  isPlaying: boolean;
  accentFrom: string;
  accentTo: string;
};

export function AnimeRadioArtwork({
  src,
  alt,
  isPlaying,
  accentFrom,
  accentTo,
}: AnimeRadioArtworkProps) {
  return (
    <div className="relative mx-auto h-52 w-52 sm:h-60 sm:w-60">
      <div
        className={`absolute inset-0 rounded-full blur-2xl ${isPlaying ? "animate-[radio-glow_2.4s_ease-in-out_infinite]" : "opacity-40"}`}
        style={{
          background: `linear-gradient(135deg, ${accentFrom}88, ${accentTo}66)`,
        }}
      />

      <div
        className={`absolute inset-3 rounded-full border border-white/10 ${isPlaying ? "animate-[vinyl-spin_14s_linear_infinite]" : ""}`}
        style={{
          background: `conic-gradient(from 180deg, ${accentFrom}, ${accentTo}, ${accentFrom})`,
        }}
      />

      <div className="absolute inset-6 overflow-hidden rounded-full border-2 border-white/20 shadow-2xl shadow-black/40">
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover transition-transform duration-700 ${isPlaying ? "scale-105" : "scale-100"}`}
          sizes="(max-width: 640px) 208px, 240px"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10" />
      </div>

      <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/80 shadow-inner" />
    </div>
  );
}
