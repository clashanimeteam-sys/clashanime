"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function BrandLogo({ className = "h-28 w-28", priority = false }: BrandLogoProps) {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Image
      src={isDark ? "/logo-dark.png" : "/logo.png"}
      alt="ClashAnime"
      width={112}
      height={112}
      priority={priority}
      className={`object-contain transition-[filter] duration-300 ${className} ${
        isDark
          ? "drop-shadow-[0_0_14px_rgba(179,27,27,0.35)]"
          : "drop-shadow-[0_4px_10px_rgba(0,0,0,0.12)]"
      }`}
    />
  );
}
