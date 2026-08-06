"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIcon } from "@/components/nav/NavIcon";
import { ElementalSiteTitle } from "@/components/ElementalSiteTitle";
import { BrandLogo } from "@/components/BrandLogo";
import { LocaleFlags } from "@/components/LocaleFlags";
import { SidebarMenuToggle } from "@/components/SidebarMenuToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { isStaff } from "@/lib/admin";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";
import { useSidebar } from "@/providers/SidebarProvider";

const mainNavItems = [
  { key: "stories" as const, href: "/stories", icon: "book" },
  { key: "manga" as const, href: "/manga", icon: "manga" },
  { key: "gallery" as const, href: "/gallery", icon: "image" },
  { key: "animeTracker" as const, href: "/tracker", icon: "radar" },
  { key: "music" as const, href: "/music", icon: "music" },
  { key: "heroesGuide" as const, href: "/blog", icon: "guide" },
];

function navLinkClass(active: boolean) {
  return `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
    active
      ? "bg-accent/15 text-accent"
      : "text-zinc-600 hover:bg-white hover:text-black dark:text-zinc-400 dark:hover:bg-black dark:hover:text-white"
  }`;
}

export function Sidebar() {
  const pathname = usePathname();
  const { profile } = useAuth();
  const { t } = useLocale();
  const { setDesktopCollapsed } = useSidebar();
  const showAdminLink = isStaff(profile);

  return (
    <aside className="flex h-dvh w-56 shrink-0 flex-col border-e border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black lg:w-60">
      <div className="flex items-center border-b border-zinc-200 px-3 py-3 dark:border-zinc-800">
        <SidebarMenuToggle
          label={t.sidebar.hideMenu}
          expanded
          onClick={() => setDesktopCollapsed(true)}
        />
      </div>
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
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link key={item.key} href={item.href} className={navLinkClass(active)}>
              <NavIcon icon={item.icon} />
              {t.nav[item.key]}
            </Link>
          );
        })}
      </nav>

      <div className="relative z-50 space-y-3 border-t border-zinc-200 p-3 dark:border-zinc-800">
        {showAdminLink ? (
          <Link href="/admin" className={navLinkClass(pathname.startsWith("/admin"))}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            {t.admin.panelTitle}
          </Link>
        ) : null}
        <div className="flex items-center justify-between gap-2">
          <LocaleFlags />
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}

export function SidebarRail() {
  const { t } = useLocale();
  const { setDesktopCollapsed } = useSidebar();

  return (
    <aside className="flex h-dvh w-14 shrink-0 flex-col items-center border-e border-zinc-200 bg-white py-4 dark:border-zinc-800 dark:bg-black">
      <SidebarMenuToggle
        label={t.sidebar.showMenu}
        expanded={false}
        onClick={() => setDesktopCollapsed(false)}
      />
    </aside>
  );
}
