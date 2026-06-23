"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type PageBackLinkProps = {
  href: string;
  label: string;
  className?: string;
};

type PageBackButtonProps = {
  label: string;
  fallbackHref: string;
  className?: string;
};

export function BackArrowIcon({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`inline-block text-base leading-none rtl:rotate-180 ${className}`}>
      ←
    </span>
  );
}

const baseClassName =
  "inline-flex items-center gap-1.5 text-sm font-semibold text-violet-700 underline-offset-2 transition hover:underline dark:text-violet-300";

export function PageBackLink({ href, label, className = "" }: PageBackLinkProps) {
  return (
    <Link href={href} className={`${baseClassName} ${className}`}>
      <BackArrowIcon />
      <span>{label}</span>
    </Link>
  );
}

export function PageBackButton({ label, fallbackHref, className = "" }: PageBackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          router.back();
          return;
        }
        router.push(fallbackHref);
      }}
      className={`${baseClassName} ${className}`}
    >
      <BackArrowIcon />
      <span>{label}</span>
    </button>
  );
}
