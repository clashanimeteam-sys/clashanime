"use client";

import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { PageBackLink } from "@/components/PageBackLink";
import { useLocale } from "@/providers/LocaleProvider";

type AuthShellHeaderProps = {
  mode: "login" | "signup";
};

export function AuthShellHeader({ mode }: AuthShellHeaderProps) {
  const { t } = useLocale();

  return (
    <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <PageBackLink href="/" label={t.common.backToHome} className="shrink-0 text-zinc-700 dark:text-zinc-300" />
        <BrandMark />
      </div>
      {mode === "login" ? (
        <Link
          href="/signup"
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-950"
        >
          {t.auth.signUp}
        </Link>
      ) : (
        <Link
          href="/login"
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-950"
        >
          {t.auth.logIn}
        </Link>
      )}
    </div>
  );
}
