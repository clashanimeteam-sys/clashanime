"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

function UserAvatar({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl?: string | null;
}) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name}
        width={32}
        height={32}
        className="h-8 w-8 rounded-full object-cover"
        unoptimized
      />
    );
  }

  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
      {initials || "CA"}
    </span>
  );
}

export function AuthTopBar() {
  const { user, profile, loading } = useAuth();
  const { t } = useLocale();
  const pathname = usePathname();

  const displayName =
    profile?.display_name ??
    user?.user_metadata?.full_name ??
    user?.email ??
    "Clash Anime";

  const avatarUrl =
    profile?.avatar_url ??
    user?.user_metadata?.avatar_url ??
    user?.user_metadata?.picture ??
    null;

  if (pathname === "/login" || pathname === "/signup" || pathname.startsWith("/auth/")) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800 sm:px-6">
      <div className="md:hidden">
        <BrandMark />
      </div>
      <div className="hidden md:block" aria-hidden />
      <div className="flex items-center gap-3">
        {loading ? (
          <span className="h-9 w-24 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
        ) : user ? (
          <>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-950"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
                <path strokeLinecap="round" d="M12 5v14M5 12h14" />
              </svg>
              {t.upload.create}
            </Link>
            <Link
              href="/profile"
              className="rounded-full transition-opacity hover:opacity-80"
              aria-label={t.profile.customize}
            >
              <UserAvatar name={displayName} avatarUrl={avatarUrl} />
            </Link>
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
    </div>
  );
}
