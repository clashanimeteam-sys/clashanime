"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { AnimeSearchButton } from "@/components/AnimeSearchButton";
import { publicWatchHomeUrl } from "@/lib/watchSiteLinks";
import { useLocale } from "@/providers/LocaleProvider";
import { getBlogPost } from "@/lib/blog/posts";
import type { BlogCategory } from "@/lib/blog/types";

type NavItem = {
  key: "home" | "stories" | "manga" | "animeNews" | "arenaGuide" | "userGuide";
  href: string;
  category?: BlogCategory;
};

const NAV_ITEMS: NavItem[] = [
  { key: "home", href: "/" },
  { key: "stories", href: "/stories" },
  { key: "manga", href: "/manga" },
  { key: "animeNews", href: "/blog/anime-news" },
  { key: "arenaGuide", href: "/blog" },
  { key: "userGuide", href: "/blog#user-guide", category: "user-guide" },
];

function blogSlugFromPath(pathname: string) {
  if (!pathname.startsWith("/blog/")) return null;
  const slug = pathname.slice("/blog/".length).split("/")[0];
  return slug || null;
}

export function BlogArenaNav() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const { t, locale } = useLocale();

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, [pathname]);

  const labelFor = (key: NavItem["key"]) => {
    if (key === "home") return t.blog.navHome;
    if (key === "stories") return t.nav.stories;
    if (key === "manga") return t.nav.manga;
    if (key === "animeNews") return t.blog.animeNews.hubTitle;
    if (key === "arenaGuide") return t.footer.arenaGuide;
    if (key === "userGuide") return t.blog.categories["user-guide"];
    return key;
  };

  const isNavActive = (item: NavItem) => {
    if (item.key === "home") return pathname === "/";
    if (item.key === "stories") return pathname.startsWith("/stories");
    if (item.key === "manga") return pathname.startsWith("/manga");
    if (item.key === "animeNews") {
      return pathname === "/blog/anime-news" || pathname.startsWith("/blog/anime-news/");
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
          <a
            href={publicWatchHomeUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm shadow-orange-950/40 transition hover:bg-orange-400 sm:inline-flex"
          >
            {locale === "ar" ? "شاهد الأنمي" : locale === "ja" ? "視聴する" : "Watch Anime"}
          </a>
          <AnimeSearchButton tone="dark" />
        </div>
      </div>
    </header>
  );
}
