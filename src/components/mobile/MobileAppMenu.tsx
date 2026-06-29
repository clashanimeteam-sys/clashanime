"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { LocaleFlags } from "@/components/LocaleFlags";
import { NavIcon } from "@/components/nav/NavIcon";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";
import type { Locale } from "@/lib/types";

type MobileAppMenuProps = {
  open: boolean;
  onClose: () => void;
};

const menuItems = [
  { key: "music" as const, href: "/music", icon: "music" },
  { key: "exclusives" as const, href: "/exclusives", icon: "star" },
  { key: "animeTracker" as const, href: "/tracker", icon: "radar" },
  { key: "inviteFriends" as const, href: "/profile#referral", icon: "invite", auth: true },
  { key: "clashCoins" as const, href: "/profile#wallet", icon: "wallet", auth: true },
  { key: "channel" as const, href: "/profile", icon: "channel", auth: true },
  { key: "myVideos" as const, href: "/profile#my-videos", icon: "video", auth: true },
  { key: "channelSettings" as const, href: "/profile", icon: "settings", auth: true },
  { key: "hunterSystem" as const, href: "/profile#hunter-system", icon: "trophy", auth: true },
  { key: "bountyRewards" as const, href: "/profile#bounty-log", icon: "coins", auth: true },
];

const locales: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ja", label: "JA" },
  { code: "ar", label: "AR" },
];

export function MobileAppMenu({ open, onClose }: MobileAppMenuProps) {
  const { user } = useAuth();
  const { locale, setLocale, t } = useLocale();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] md:hidden" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label={t.mobileApp.closeMenu}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-app-menu-title"
        className="absolute inset-x-0 bottom-0 max-h-[min(82dvh,720px)] overflow-hidden rounded-t-3xl border-t border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
        style={{ paddingBottom: "calc(4.75rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="flex justify-center pt-3">
          <span className="h-1 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700" aria-hidden />
        </div>

        <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-4">
          <div>
            <h2 id="mobile-app-menu-title" className="text-lg font-bold text-black dark:text-white">
              {t.mobileApp.menuTitle}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{t.mobileApp.menuSubtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-zinc-200 p-2 text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
            aria-label={t.mobileApp.closeMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-4 pb-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {menuItems.map((item) => {
              const href =
                item.auth && !user
                  ? `/login?next=${encodeURIComponent(item.href)}`
                  : item.href;

              return (
                <Link
                  key={item.key}
                  href={href}
                  onClick={onClose}
                  className="flex min-h-[4.5rem] flex-col items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-2 py-3 text-center text-xs font-semibold text-zinc-800 transition-colors active:bg-accent/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <NavIcon icon={item.icon} className="h-7 w-7 shrink-0 object-contain" />
                  <span className="line-clamp-2 leading-tight">{t.nav[item.key]}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {t.mobileApp.preferences}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div
                className="flex items-center rounded-lg border border-zinc-200 bg-white p-0.5 dark:border-zinc-700 dark:bg-black"
                role="group"
                aria-label={t.locale.label}
              >
                {locales.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setLocale(item.code)}
                    className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                      locale === item.code
                        ? "bg-accent text-white"
                        : "text-zinc-600 dark:text-zinc-400"
                    }`}
                    aria-pressed={locale === item.code}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <LocaleFlags />
                <ThemeToggle />
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 text-xs">
            <Link
              href="/legal"
              onClick={onClose}
              className="rounded-xl border border-accent/30 bg-accent/5 px-3 py-3 font-semibold text-accent dark:border-accent/40 dark:bg-accent/10"
            >
              {t.legalHub.pageTitle}
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/about"
                onClick={onClose}
                className="rounded-xl border border-zinc-200 px-3 py-2.5 font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-300"
              >
                {t.footer.about}
              </Link>
              <Link
                href="/contact"
                onClick={onClose}
                className="rounded-xl border border-zinc-200 px-3 py-2.5 font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-300"
              >
                {t.footer.contact}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
