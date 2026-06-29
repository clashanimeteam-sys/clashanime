"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  compact?: boolean;
  withHat?: boolean;
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
  withHat = true,
}: BrandLogoProps) {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isDark = mounted && resolvedTheme === "dark";
  const showHat = withHat && !compact;

  return (
    <div
      className={`brand-logo-wrap relative overflow-visible ${className} ${
        compact
          ? ""
          : isDark
            ? "drop-shadow-[0_0_18px_rgba(227,49,36,0.35)]"
            : "drop-shadow-[0_4px_10px_rgba(0,0,0,0.12)]"
      }`}
    >
      <Image
        src="/brand-logo-hinata-inner.png"
        alt={compact ? "" : "Clash Anime"}
        fill
        priority={priority}
        sizes={compact ? "20px" : "(max-width: 768px) 72px, 112px"}
        aria-hidden={compact ? true : undefined}
        className="object-contain"
      />
      {showHat ? (
        <div className="brand-logo-hat" aria-hidden>
          <Image
            src="/brand-straw-hat.png"
            alt=""
            fill
            priority={priority}
            sizes={compact ? "20px" : "(max-width: 768px) 72px, 112px"}
            className="object-contain object-bottom"
          />
        </div>
      ) : null}
    </div>
  );
}
