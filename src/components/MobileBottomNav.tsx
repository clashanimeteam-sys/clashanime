"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MobileAppMenu } from "@/components/mobile/MobileAppMenu";
import { NavIcon } from "@/components/nav/NavIcon";
import { useLocale } from "@/providers/LocaleProvider";

const tabItems = [
  {
    key: "stories" as const,
    href: "/stories",
    icon: "book",
    match: (path: string) => path === "/" || path.startsWith("/stories"),
  },
  {
    key: "manga" as const,
    href: "/manga",
    icon: "manga",
    match: (path: string) => path.startsWith("/manga"),
  },
  {
    key: "gallery" as const,
    href: "/gallery",
    icon: "image",
    match: (path: string) => path.startsWith("/gallery"),
  },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);

  const moreActive =
    menuOpen ||
    pathname.startsWith("/music") ||
    pathname.startsWith("/tracker") ||
    pathname.startsWith("/blog") ||
    pathname === "/legal" ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/contact");

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeMenu = () => setMenuOpen(false);
    window.addEventListener("hashchange", closeMenu);
    return () => window.removeEventListener("hashchange", closeMenu);
  }, [menuOpen]);

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
                href="/blog"
                className="-mt-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/35 ring-4 ring-white transition-transform active:scale-95 dark:ring-black"
                aria-label={t.nav.heroesGuide}
              >
                <NavIcon icon="guide" className="h-7 w-7 shrink-0 text-white" />
              </Link>
            </li>

            <li>
              <Link
                href="/gallery"
                className={`flex flex-col items-center gap-1 px-1 py-2.5 text-[10px] font-semibold transition-colors ${
                  tabItems[2].match(pathname) ? "text-accent" : "text-zinc-500 dark:text-zinc-400"
                }`}
                aria-current={tabItems[2].match(pathname) ? "page" : undefined}
              >
                <NavIcon icon="image" className="h-6 w-6 shrink-0 object-contain" />
                <span className="max-w-full truncate leading-none">{t.nav.gallery}</span>
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
              >
                <NavIcon icon="settings" className="h-6 w-6 shrink-0 object-contain" />
                <span className="leading-none">{t.nav.more}</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <MobileAppMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
