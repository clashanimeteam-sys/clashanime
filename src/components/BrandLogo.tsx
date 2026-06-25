"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  compact?: boolean;
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

export function BrandLogo({
  className = "h-28 w-28",
  priority = false,
  compact = false,
}: BrandLogoProps) {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div
      className={`relative ${className} ${
        compact
          ? ""
          : isDark
            ? "drop-shadow-[0_0_20px_rgba(220,38,38,0.42)]"
            : "drop-shadow-[0_4px_10px_rgba(0,0,0,0.12)]"
      }`}
    >
      <Image
        src={isDark ? "/logo-dark.png" : "/logo-light.png"}
        alt={compact ? "" : "Clash Anime"}
        fill
        priority={priority}
        sizes={compact ? "20px" : "(max-width: 768px) 72px, 112px"}
        aria-hidden={compact ? true : undefined}
        className={
          compact
            ? "object-contain"
            : "object-contain brightness-[1.04] contrast-[1.06] saturate-[1.1]"
        }
      />
    </div>
  );
}
