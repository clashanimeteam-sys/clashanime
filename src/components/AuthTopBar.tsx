"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { AnimeSearchButton } from "@/components/AnimeSearchButton";
import { ClashLiveBadge } from "@/components/clash/ClashLiveBadge";
import { NotificationBell } from "@/components/NotificationBell";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitleContext } from "@/providers/PageTitleProvider";

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
  const { title: pageTitle } = usePageTitleContext();

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

  const isHome = pathname === "/";

  const actionButtons = loading ? (
    <span className="h-9 w-24 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
  ) : (
    <>
      <AnimeSearchButton />
      {user ? <NotificationBell /> : null}
      <Link
        href={user ? "/upload" : "/login?next=%2Fupload"}
        className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-950"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
          <path strokeLinecap="round" d="M12 5v14M5 12h14" />
        </svg>
        {t.upload.create}
      </Link>
      {user ? (
        <Link
          href="/profile"
          className="rounded-full transition-opacity hover:opacity-80"
          aria-label={t.profile.customize}
        >
          <UserAvatar name={displayName} avatarUrl={avatarUrl} />
        </Link>
      ) : (
        <>
          <Link
            href="/login?next=%2Fupload"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-black dark:text-zinc-300 dark:hover:text-white"
          >
            {t.auth.logIn}
          </Link>
          <Link
            href="/signup?next=%2Fupload"
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-950"
          >
            {t.auth.signUp}
          </Link>
        </>
      )}
    </>
  );

  const leftSlot = isHome ? (
    <ClashLiveBadge />
  ) : pageTitle ? (
    <h1 className="page-corner-title">{pageTitle}</h1>
  ) : (
    <div className="md:hidden">
      <BrandMark />
    </div>
  );

  return (
    <div
      className={`flex items-stretch justify-between ${isHome ? "" : "gap-3 px-4 sm:px-6"}`}
    >
      <div className="flex min-w-0 items-center">{leftSlot}</div>
      <div
        className={`flex shrink-0 items-center gap-3 py-2 ${isHome ? "px-4 sm:px-6" : ""}`}
      >
        {actionButtons}
      </div>
    </div>
  );
}
