"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { useLocale } from "@/providers/LocaleProvider";

type BrandMarkProps = {
  className?: string;
  showLabel?: boolean;
};

export function BrandMark({ className = "", showLabel = true }: BrandMarkProps) {
  const { t } = useLocale();

  return (
    <Link
      href="/"
      aria-label={t.auth.backHome}
      className={`inline-flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-80 ${className}`}
    >
      <BrandLogo className="h-8 w-8 shrink-0" />
      {showLabel && (
        <span className="font-display text-sm font-bold uppercase tracking-[0.12em] text-black dark:text-white">
          Clash<span className="text-brand"> Anime</span>
        </span>
      )}
    </Link>
  );
}
