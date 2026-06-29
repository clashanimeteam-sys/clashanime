"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MobileAppMenu } from "@/components/mobile/MobileAppMenu";
import { NavIcon } from "@/components/nav/NavIcon";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

const tabItems = [
  { key: "clash" as const, href: "/", icon: "clash", match: (path: string) => path === "/" },
  {
    key: "videos" as const,
    href: "/videos",
    icon: "video",
    match: (path: string) => path.startsWith("/videos") || path.startsWith("/video/"),
  },
  {
    key: "community" as const,
    href: "/community",
    icon: "users",
    match: (path: string) => path.startsWith("/community"),
  },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);

  const uploadHref = user ? "/upload" : `/login?next=${encodeURIComponent("/upload")}`;
  const moreActive =
    menuOpen ||
    pathname.startsWith("/music") ||
    pathname.startsWith("/exclusives") ||
    pathname.startsWith("/profile") ||
    pathname === "/settings" ||
    pathname === "/legal" ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/contact");

  return (
    <>
      <nav
        className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-40 md:hidden"
        aria-label={t.nav.mobileBottomNav}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="border-t border-zinc-200/90 bg-white/95 backdrop-blur-xl dark:border-zinc-800/90 dark:bg-black/95">
          <ul className="relative mx-auto grid max-w-lg grid-cols-5 items-end px-1">
            {tabItems.slice(0, 2).map((item) => {
              const active = item.match(pathname);
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className={`flex flex-col items-center gap-1 px-1 py-2.5 text-[10px] font-semibold transition-colors ${
                      active ? "text-accent" : "text-zinc-500 dark:text-zinc-400"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    <NavIcon icon={item.icon} className="h-6 w-6 shrink-0 object-contain" />
                    <span className="max-w-full truncate leading-none">{t.nav[item.key]}</span>
                  </Link>
                </li>
              );
            })}

            <li className="flex justify-center">
              <Link
                href={uploadHref}
                className="-mt-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/35 ring-4 ring-white transition-transform active:scale-95 dark:ring-black"
                aria-label={t.upload.create}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-7 w-7" aria-hidden>
                  <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                </svg>
              </Link>
            </li>

            <li>
              <Link
                href="/community"
                className={`flex flex-col items-center gap-1 px-1 py-2.5 text-[10px] font-semibold transition-colors ${
                  tabItems[2].match(pathname) ? "text-accent" : "text-zinc-500 dark:text-zinc-400"
                }`}
                aria-current={tabItems[2].match(pathname) ? "page" : undefined}
              >
                <NavIcon icon={tabItems[2].icon} className="h-6 w-6 shrink-0 object-contain" />
                <span className="max-w-full truncate leading-none">{t.nav[tabItems[2].key]}</span>
              </Link>
            </li>

            <li>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className={`flex w-full flex-col items-center gap-1 px-1 py-2.5 text-[10px] font-semibold transition-colors ${
                  moreActive ? "text-accent" : "text-zinc-500 dark:text-zinc-400"
                }`}
                aria-expanded={menuOpen}
                aria-haspopup="dialog"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden>
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
                <span className="max-w-full truncate leading-none">{t.nav.more}</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <MobileAppMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
