"use client";

import Image from "next/image";

export function ClashHeroBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[min(62vh,520px)] overflow-hidden"
    >
      <Image
        src="/anime-heroes-backdrop.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_20%] opacity-[0.38] saturate-[1.05] contrast-[1.08] dark:opacity-[0.28] dark:saturate-[0.95] dark:contrast-[1.05]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/18 to-white dark:from-black/65 dark:via-black/40 dark:to-black" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-black dark:via-black/85 dark:to-transparent" />
    </div>
  );
}
