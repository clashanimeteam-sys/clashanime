"use client";

import { useLocale } from "@/providers/LocaleProvider";

type VerifiedBadgeProps = {
  className?: string;
  size?: "sm" | "md";
};

export function VerifiedBadge({ className = "", size = "sm" }: VerifiedBadgeProps) {
  const { t } = useLocale();
  const dim = size === "md" ? "h-5 w-5" : "h-4 w-4";
  const icon = size === "md" ? "h-3 w-3" : "h-2.5 w-2.5";

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-sky-500 text-white ${dim} ${className}`}
      title={t.profile.verifiedBadge}
      aria-label={t.profile.verifiedBadge}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={icon}
        aria-hidden
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </span>
  );
}
