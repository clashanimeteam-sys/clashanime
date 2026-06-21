"use client";

import { ClashAnimeMark } from "@/components/ClashAnimeMark";
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
    <ClashAnimeMark
      className={`transition-[filter] duration-300 ${className} ${
        isDark
          ? "drop-shadow-[0_0_14px_rgba(179,27,27,0.35)]"
          : "drop-shadow-[0_4px_10px_rgba(0,0,0,0.12)]"
      }`}
    />
  );
}
