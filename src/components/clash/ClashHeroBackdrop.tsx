"use client";

import Image from "next/image";

export function ClashHeroBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[min(52vh,420px)] overflow-hidden"
    >
      <Image
        src="/anime-heroes-backdrop.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-[0.14] saturate-[0.85] contrast-[0.95] dark:opacity-[0.1] dark:saturate-[0.7]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/35 to-white dark:from-black/80 dark:via-black/55 dark:to-black" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent dark:from-black dark:to-transparent" />
    </div>
  );
}
