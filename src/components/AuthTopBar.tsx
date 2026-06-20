"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

export function AuthTopBar() {
  const { user, loading, signOut } = useAuth();
  const { t } = useLocale();
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/signup" || pathname === "/auth/callback") {
    return null;
  }

  return (
    <div className="flex items-center justify-end gap-3 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800 sm:px-6">
      {loading ? (
        <span className="h-9 w-24 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
      ) : user ? (
        <>
          <span className="hidden max-w-[180px] truncate text-sm text-zinc-600 dark:text-zinc-400 sm:inline">
            {user.user_metadata?.full_name ?? user.email}
          </span>
          <button
            type="button"
            onClick={() => signOut()}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-950"
          >
            {t.auth.signOut}
          </button>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-black dark:text-zinc-300 dark:hover:text-white"
          >
            {t.auth.logIn}
          </Link>
          <Link
            href="/signup"
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-950"
          >
            {t.auth.signUp}
          </Link>
        </>
      )}
    </div>
  );
}
