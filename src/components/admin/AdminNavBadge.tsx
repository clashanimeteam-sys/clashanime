"use client";

import { useLocale } from "@/providers/LocaleProvider";

type AdminNavBadgeProps = {
  count: number;
  className?: string;
};

export function AdminNavBadge({ count, className = "" }: AdminNavBadgeProps) {
  const { formatNumber } = useLocale();

  if (count <= 0) return null;

  const label = count > 99 ? "99+" : formatNumber(count);

  return (
    <span
      className={`inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold leading-none text-white ${className}`}
      aria-label={label}
    >
      {label}
    </span>
  );
}
