"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIcon } from "@/components/nav/NavIcon";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

const mobileNavItems = [
  { key: "clash" as const, href: "/", icon: "clash", match: (path: string) => path === "/" },
  { key: "videos" as const, href: "/videos", icon: "video", match: (path: string) => path.startsWith("/videos") || path.startsWith("/video/") },
  { key: "community" as const, href: "/community", icon: "users", match: (path: string) => path.startsWith("/community") },
  { key: "animeTracker" as const, href: "/tracker", icon: "radar", match: (path: string) => path.startsWith("/tracker") },
  { key: "channelSettings" as const, href: "/profile", icon: "profile", match: (path: string) => path.startsWith("/profile") || path === "/settings" },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useLocale();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-black/95 md:hidden"
      aria-label={t.nav.mobileBottomNav}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {mobileNavItems.map((item) => {
          const href =
            item.key === "channelSettings" && !user
              ? `/login?next=${encodeURIComponent("/profile")}`
              : item.href;
          const active = item.match(pathname);

          return (
            <li key={item.key}>
              <Link
                href={href}
                className={`flex flex-col items-center gap-1 px-1 py-2.5 text-[10px] font-semibold transition-colors ${
                  active ? "text-accent" : "text-zinc-500 dark:text-zinc-400"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <NavIcon icon={item.icon} className="h-6 w-6 shrink-0 object-contain" />
                <span className="max-w-full truncate leading-none">
                  {item.key === "channelSettings" ? t.nav.channel : t.nav[item.key]}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
