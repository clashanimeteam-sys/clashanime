"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { ClashLiveBadge } from "@/components/clash/ClashLiveBadge";
import { ElementalSiteTitle } from "@/components/ElementalSiteTitle";
import { NotificationBell } from "@/components/NotificationBell";
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
        width={36}
        height={36}
        className="h-9 w-9 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
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
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-700 ring-2 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700">
      {initials || "CA"}
    </span>
  );
}

export function MobileAppHeader() {
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

  const isHome = pathname === "/";

  return (
    <header
      className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/95 backdrop-blur-md dark:border-zinc-800/80 dark:bg-black/95 md:hidden"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="flex min-h-14 items-center justify-between gap-2 px-3 py-1.5">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="flex shrink-0 flex-col items-center gap-1">
            <Link href="/" aria-label="Clash Anime">
              <BrandLogo className="h-[3.35rem] w-[3.35rem]" priority />
            </Link>
            {isHome ? <ClashLiveBadge compact /> : null}
          </div>

          <Link
            href="/"
            className="min-w-0 flex-1 self-center"
            aria-label={`${t.home.titlePrimary}${t.home.titleSecondary}`}
          >
            <ElementalSiteTitle
              primary={t.home.titlePrimary}
              secondary={t.home.titleSecondary}
              variant="mobile-header"
            />
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {loading ? (
            <span className="h-9 w-16 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-900" />
          ) : (
            <>
              {user ? <NotificationBell /> : null}
              {user ? (
                <Link href="/profile" className="rounded-full" aria-label={t.profile.customize}>
                  <UserAvatar name={displayName} avatarUrl={avatarUrl} />
                </Link>
              ) : (
                <Link
                  href="/login?next=%2Fupload"
                  className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-black dark:border-zinc-700 dark:text-white"
                >
                  {t.auth.logIn}
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
