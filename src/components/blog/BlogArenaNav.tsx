"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { AnimeSearchButton } from "@/components/AnimeSearchButton";
import { NotificationBell } from "@/components/NotificationBell";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

import { getBlogPost } from "@/lib/blog/posts";
import type { BlogCategory } from "@/lib/blog/types";

type NavItem = {
  key: "home" | "clash" | "community" | "animeNews" | "watchNow" | "arenaGuide" | "userGuide";
  href: string;
  category?: BlogCategory;
};

const NAV_ITEMS: NavItem[] = [
  { key: "home", href: "/" },
  { key: "clash", href: "/" },
  { key: "community", href: "/community" },
  { key: "animeNews", href: "/blog/anime-news" },
  { key: "watchNow", href: "/blog/anime-news/watch-now" },
  { key: "arenaGuide", href: "/blog" },
  { key: "userGuide", href: "/blog#user-guide", category: "user-guide" },
];

function UserAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string | null }) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name}
        width={32}
        height={32}
        className="h-8 w-8 rounded-full object-cover ring-2 ring-zinc-700"
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
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-white ring-2 ring-zinc-700">
      {initials || "CA"}
    </span>
  );
}

function blogSlugFromPath(pathname: string) {
  if (!pathname.startsWith("/blog/")) return null;
  const slug = pathname.slice("/blog/".length).split("/")[0];
  return slug || null;
}

export function BlogArenaNav() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const { user, profile, loading } = useAuth();
  const { t } = useLocale();

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, [pathname]);

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

  const labelFor = (key: NavItem["key"]) => {
    if (key === "home") return t.blog.navHome;
    if (key === "animeNews") return t.blog.animeNews.hubTitle;
    if (key === "watchNow") return t.blog.animeNews.watchNowHeading;
    if (key === "arenaGuide") return t.footer.arenaGuide;
    if (key === "userGuide") return t.blog.categories["user-guide"];
    return t.nav[key];
  };

  const isNavActive = (item: NavItem) => {
    if (item.key === "home") return pathname === "/";
    if (item.key === "clash") return pathname === "/" || pathname.startsWith("/tracker");
    if (item.key === "community") {
      return pathname === item.href || pathname.startsWith(`${item.href}/`);
    }
    if (item.key === "animeNews") {
      return (
        pathname === "/blog/anime-news" ||
        (pathname.startsWith("/blog/anime-news/") && !pathname.startsWith("/blog/anime-news/watch-now"))
      );
    }
    if (item.key === "watchNow") {
      return pathname === "/blog/anime-news/watch-now" || pathname.startsWith("/blog/anime-news/watch-now/");
    }
    if (item.key === "arenaGuide") {
      if (pathname === "/blog") return hash !== "#user-guide";
      const slug = blogSlugFromPath(pathname);
      if (!slug || slug === "anime-news") return false;
      return getBlogPost(slug)?.category !== "user-guide";
    }
    if (item.key === "userGuide") {
      if (pathname === "/blog" && hash === "#user-guide") return true;
      const slug = blogSlugFromPath(pathname);
      return slug ? getBlogPost(slug)?.category === "user-guide" : false;
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <BrandMark
          logoClassName="h-12 w-12 shrink-0 sm:h-14 sm:w-14"
          labelClassName="text-base sm:text-lg tracking-[0.14em]"
          className="shrink-0 gap-3 [&_.text-brand]:text-orange-400 [&_span]:text-white"
          showLabel
        />

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto md:flex"
          aria-label={t.blog.hubTitle}
        >
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(item);

            return (
              <Link
                key={item.key}
                href={item.href}
                className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-orange-500/15 text-orange-300"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                {labelFor(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {loading ? (
            <span className="h-9 w-20 animate-pulse rounded-lg bg-zinc-800" />
          ) : user ? (
            <>
              <AnimeSearchButton tone="dark" />
              <NotificationBell />
              <Link
                href="/profile"
                className="hidden items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition hover:border-zinc-600 sm:inline-flex"
                aria-label={t.profile.customize}
              >
                <UserAvatar name={displayName} avatarUrl={avatarUrl} />
                <span className="max-w-[120px] truncate">{t.blog.navAccount}</span>
              </Link>
              <Link href="/profile" className="sm:hidden" aria-label={t.profile.customize}>
                <UserAvatar name={displayName} avatarUrl={avatarUrl} />
              </Link>
            </>
          ) : (
            <>
              <AnimeSearchButton tone="dark" />
              <Link
                href="/login?next=%2Fblog"
                className="text-sm font-medium text-zinc-300 transition hover:text-white"
              >
                {t.auth.logIn}
              </Link>
              <Link
                href="/signup?next=%2Fblog"
                className="rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                {t.auth.signUp}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
