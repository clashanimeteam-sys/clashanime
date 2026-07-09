"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { NavIcon } from "@/components/nav/NavIcon";
import { ElementalSiteTitle } from "@/components/ElementalSiteTitle";
import { BrandLogo } from "@/components/BrandLogo";
import { LocaleFlags } from "@/components/LocaleFlags";
import { ThemeToggle } from "@/components/ThemeToggle";
import { isStaff } from "@/lib/admin";
import { navigateAppHref } from "@/lib/appNavigation";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";
import {
  parseProfileSection,
  useProfileSection,
  type ProfileSection,
} from "@/providers/ProfileSectionProvider";

const mainNavItems = [
  { key: "clash" as const, href: "/", icon: "clash" },
  { key: "videos" as const, href: "/videos", icon: "video" },
  { key: "community" as const, href: "/community", icon: "users" },
  { key: "music" as const, href: "/music", icon: "music" },
  { key: "exclusives" as const, href: "/exclusives", icon: "star" },
  { key: "inviteFriends" as const, href: "/profile#referral", icon: "invite", referral: true as const },
  { key: "animeTracker" as const, href: "/tracker", icon: "radar" },
  { key: "clashCoins" as const, href: "/profile#wallet", icon: "wallet", wallet: true as const },
  { key: "earnMoney" as const, href: "/earn", icon: "earn" },
];

const profileNavItems: {
  key: "channelSettings" | "channel" | "myVideos" | "hunterSystem" | "bountyRewards" | "clashWallet";
  section: ProfileSection;
  icon: string;
}[] = [
  { key: "channelSettings", section: "settings", icon: "settings" },
  { key: "channel", section: "channel", icon: "channel" },
  { key: "myVideos", section: "my-videos", icon: "video" },
  { key: "hunterSystem", section: "hunter-system", icon: "trophy" },
  { key: "bountyRewards", section: "bounty-log", icon: "coins" },
  { key: "clashWallet", section: "wallet", icon: "wallet" },
];

function profileSectionHref(section: ProfileSection, loggedIn: boolean) {
  const target = section === "settings" ? "/profile" : `/profile#${section}`;
  return loggedIn ? target : `/login?next=${encodeURIComponent(target)}`;
}

function profileSectionFromHref(href: string): ProfileSection | null {
  if (href === "/profile") return "settings";
  const match = href.match(/^\/profile#(.+)$/);
  if (!match) return null;
  return parseProfileSection(match[1]);
}

function navLinkClass(active: boolean) {
  return `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
    active
      ? "bg-accent/15 text-accent"
      : "text-zinc-600 hover:bg-white hover:text-black dark:text-zinc-400 dark:hover:bg-black dark:hover:text-white"
  }`;
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile } = useAuth();
  const { t } = useLocale();
  const { section, setSection, isProfilePage } = useProfileSection();
  const showAdminLink = isStaff(profile);

  function handleNavClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    const profileTarget = profileSectionFromHref(href);
    if (profileTarget && isProfilePage && user) {
      event.preventDefault();
      setSection(profileTarget);
      return;
    }

    const [path, hash = ""] = href.split("#");
    const targetPath = path || pathname;
    if (hash && targetPath === pathname) {
      event.preventDefault();
      navigateAppHref(router, pathname, href);
    }
  }

  return (
    <aside className="flex h-dvh w-56 shrink-0 flex-col border-e border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black lg:w-60">
      <div className="border-b border-zinc-200 px-2 py-4 dark:border-zinc-800 sm:px-3">
        <Link href="/" className="flex justify-center">
          <BrandLogo priority />
        </Link>

        <Link
          href="/"
          className="group mt-4 flex justify-center"
          aria-label={`${t.home.titlePrimary}${t.home.titleSecondary}`}
        >
          <ElementalSiteTitle
            primary={t.home.titlePrimary}
            secondary={t.home.titleSecondary}
          />
        </Link>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3" aria-label="Main navigation">
        {mainNavItems.map((item) => {
          const href =
            "wallet" in item && item.wallet
              ? profileSectionHref("wallet", Boolean(user))
              : "referral" in item && item.referral
                ? profileSectionHref("referral", Boolean(user))
                : item.href;
          const active =
            "wallet" in item && item.wallet
              ? isProfilePage && section === "wallet"
              : "referral" in item && item.referral
                ? isProfilePage && section === "referral"
                : pathname === item.href;

          return (
            <Link
              key={item.key}
              href={href}
              className={navLinkClass(active)}
              onClick={(event) => handleNavClick(event, href)}
            >
              <NavIcon icon={item.icon} />
              {t.nav[item.key]}
            </Link>
          );
        })}

        {isProfilePage ? (
          <>
            <div
              className="my-2 border-t border-zinc-200 dark:border-zinc-800"
              role="separator"
              aria-hidden
            />

            {profileNavItems.map((item) => {
              const href = profileSectionHref(item.section, Boolean(user));
              const active = section === item.section;
              return (
                <Link
                  key={item.key}
                  href={href}
                  className={navLinkClass(active)}
                  onClick={(event) => handleNavClick(event, href)}
                >
                  <NavIcon icon={item.icon} />
                  {t.nav[item.key]}
                </Link>
              );
            })}
          </>
        ) : null}
      </nav>

      <div className="relative z-50 space-y-3 border-t border-zinc-200 p-3 dark:border-zinc-800">
        {showAdminLink ? (
          <Link
            href="/admin"
            className={navLinkClass(pathname.startsWith("/admin"))}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            {t.admin.panelTitle}
          </Link>
        ) : null}

        <Link href="/legal" className={navLinkClass(pathname === "/legal" || pathname.startsWith("/terms") || pathname.startsWith("/privacy"))}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
            <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
            <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
            <path d="M7 21h10" />
            <path d="M12 3v18" />
            <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
          </svg>
          {t.legalHub.pageTitle}
        </Link>

        <Link href="/settings" className={navLinkClass(pathname === "/settings")}>
          <NavIcon icon="settings" />
          {t.nav.settings}
        </Link>

        <div className="flex items-center justify-between gap-2">
          <LocaleFlags />
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
