"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { LocaleFlags } from "@/components/LocaleFlags";
import { ThemeToggle } from "@/components/ThemeToggle";
import { isStaff } from "@/lib/admin";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

const mainNavItems = [
  { key: "clash" as const, href: "/", icon: "flame" },
  { key: "videos" as const, href: "/videos", icon: "video" },
  { key: "community" as const, href: "/community", icon: "users" },
  { key: "music" as const, href: "/music", icon: "music" },
  { key: "exclusives" as const, href: "/exclusives", icon: "star" },
];

const profileNavItems = [
  { key: "channelSettings" as const, hash: "settings", icon: "settings" },
  { key: "hunterSystem" as const, hash: "hunter-system", icon: "trophy" },
  { key: "bountyRewards" as const, hash: "bounty-log", icon: "coins" },
  { key: "inviteFriends" as const, hash: "referral", icon: "invite" },
];

function profileSectionHref(hash: string, loggedIn: boolean) {
  const target = hash === "settings" ? "/profile" : `/profile#${hash}`;
  return loggedIn ? target : `/login?next=${encodeURIComponent(target)}`;
}

function NavIcon({ icon }: { icon: string }) {
  if (icon === "flame") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
        <path d="M12 2c1.5 3 4 4.5 4 8a4 4 0 1 1-8 0c0-3.5 2.5-5 4-8zm0 18a6 6 0 0 0 6-6c0-4.5-3.5-7.5-6-11-2.5 3.5-6 6.5-6 11a6 6 0 0 0 6 6z" />
      </svg>
    );
  }
  if (icon === "video") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M10 9l6 3-6 3V9z" />
      </svg>
    );
  }
  if (icon === "users") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }
  if (icon === "music") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    );
  }
  if (icon === "trophy") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
        <path d="M8 21h8" />
        <path d="M12 17v4" />
        <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
        <path d="M5 4H3v2a4 4 0 0 0 4 4" />
        <path d="M19 4h2v2a4 4 0 0 1-4 4" />
      </svg>
    );
  }
  if (icon === "coins") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
        <ellipse cx="8" cy="8" rx="6" ry="3" />
        <path d="M2 8v6c0 1.7 2.7 3 6 3s6-1.3 6-3V8" />
        <path d="M14 10c0 1.7 2.7 3 6 3s6-1.3 6-3" />
        <path d="M14 16c0 1.7 2.7 3 6 3s6-1.3 6-3v-6" />
      </svg>
    );
  }
  if (icon === "invite") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M19 8v6" />
        <path d="M22 11h-6" />
      </svg>
    );
  }
  if (icon === "settings") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.8 7.2 17l.9-5.4L4.2 7.7l5.4-.8L12 2z" />
    </svg>
  );
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
  const { user, profile } = useAuth();
  const { t } = useLocale();
  const showAdminLink = isStaff(profile);
  const [hash, setHash] = useState("");
  const isProfilePage = pathname === "/profile";

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash.replace(/^#/, ""));
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, [pathname]);

  return (
    <aside className="sticky top-0 flex min-h-screen w-56 shrink-0 flex-col border-e border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black lg:w-60">
      <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
        <Link href="/" className="flex justify-center">
          <BrandLogo priority />
        </Link>

        <Link
          href="/upload"
          className="mt-4 block w-full rounded-lg bg-accent px-3 py-2 text-center text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
        >
          {t.home.upload}
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main navigation">
        {mainNavItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.key} href={item.href} className={navLinkClass(active)}>
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
              const href = profileSectionHref(item.hash, Boolean(user));
              const active =
                hash === item.hash || (item.hash === "settings" && !hash);
              return (
                <Link key={item.key} href={href} className={navLinkClass(active)}>
                  <NavIcon icon={item.icon} />
                  {t.nav[item.key]}
                </Link>
              );
            })}
          </>
        ) : null}
      </nav>

      <div className="space-y-3 border-t border-zinc-200 p-3 dark:border-zinc-800">
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

        <Link href="/settings" className={navLinkClass(pathname === "/settings")}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
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
