"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { NavIcon } from "@/components/nav/NavIcon";
import { navigateAppHref } from "@/lib/appNavigation";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";
import {
  parseProfileSection,
  useProfileSection,
  type ProfileSection,
} from "@/providers/ProfileSectionProvider";

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

function profileSectionHref(section: ProfileSection) {
  return section === "settings" ? "/profile" : `/profile#${section}`;
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
      : "text-zinc-600 hover:bg-zinc-100 hover:text-black dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
  }`;
}

function UserAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string | null }) {
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

export function ProfileMenuDropdown() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile } = useAuth();
  const { t } = useLocale();
  const { section, setSection, isProfilePage } = useProfileSection();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    setOpen(false);
  }, [pathname, section]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function handleItemClick(event: ReactMouseEvent<HTMLAnchorElement>, href: string) {
    const profileTarget = profileSectionFromHref(href);
    if (profileTarget && isProfilePage && user) {
      event.preventDefault();
      setSection(profileTarget);
      setOpen(false);
      return;
    }

    const [path, hash = ""] = href.split("#");
    const targetPath = path || pathname;
    if (hash && targetPath === pathname) {
      event.preventDefault();
      navigateAppHref(router, pathname, href);
    }
    setOpen(false);
  }

  if (!user) return null;

  return (
    <div ref={rootRef} className="relative">
      {open ? (
        <div
          className="absolute top-full end-0 z-[80] mt-2 w-60 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
          role="menu"
          aria-label={t.profile.customize}
        >
          <div className="space-y-0.5">
            {profileNavItems.map((item) => {
              const href = profileSectionHref(item.section);
              const active = isProfilePage && section === item.section;
              return (
                <Link
                  key={item.key}
                  href={href}
                  role="menuitem"
                  className={navLinkClass(active)}
                  onClick={(event) => handleItemClick(event, href)}
                >
                  <NavIcon icon={item.icon} />
                  {t.nav[item.key]}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`rounded-full transition-opacity hover:opacity-80 ${
          open || isProfilePage ? "ring-2 ring-accent/50 ring-offset-2 ring-offset-white dark:ring-offset-black" : ""
        }`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t.profile.customize}
      >
        <UserAvatar name={displayName} avatarUrl={avatarUrl} />
      </button>
    </div>
  );
}
