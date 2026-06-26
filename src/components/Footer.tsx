"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { useLocale } from "@/providers/LocaleProvider";

const discoverLinks = [
  { key: "clash" as const, href: "/" },
  { key: "videos" as const, href: "/videos" },
  { key: "community" as const, href: "/community" },
  { key: "music" as const, href: "/music" },
  { key: "exclusives" as const, href: "/exclusives" },
  { key: "animeTracker" as const, href: "/tracker" },
] as const;

const informationLinks = [
  { key: "about" as const, href: "/about" },
  { key: "privacy" as const, href: "/privacy" },
  { key: "cookies" as const, href: "/cookies" },
  { key: "disclaimer" as const, href: "/disclaimer" },
  { key: "eula" as const, href: "/eula" },
  { key: "terms" as const, href: "/terms" },
  { key: "communityGuidelines" as const, href: "/community-guidelines" },
  { key: "dmca" as const, href: "/dmca" },
  { key: "reportContent" as const, href: "/report" },
] as const;

function FooterColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">
      {children}
    </p>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block text-sm text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
    >
      {children}
    </Link>
  );
}

function SocialIcon({ type }: { type: "mail" | "report" | "guide" }) {
  if (type === "guide") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4 shrink-0" aria-hidden>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    );
  }

  if (type === "mail") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4 shrink-0" aria-hidden>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m2 7 10 7 10-7" />
      </svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4 shrink-0" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex flex-col gap-3">
              <BrandLogo className="h-14 w-14" />
              <p
                dir="ltr"
                className="doodle-logo-ltr font-display text-lg font-black uppercase italic leading-none tracking-[0.14em]"
              >
                <span className="bg-gradient-to-br from-brand via-red-600 to-orange-500 bg-clip-text text-transparent">
                  {t.home.titlePrimary}
                </span>
                <span className="text-black dark:text-white">{t.home.titleSecondary}</span>
              </p>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-500">{t.footer.tagline}</p>
          </div>

          <div>
            <FooterColumnHeading>{t.footer.discoverHeading}</FooterColumnHeading>
            <nav className="flex flex-col gap-2.5" aria-label={t.footer.discoverHeading}>
              {discoverLinks.map((item) => (
                <FooterLink key={item.key} href={item.href}>
                  {t.nav[item.key]}
                </FooterLink>
              ))}
            </nav>
          </div>

          <div>
            <FooterColumnHeading>{t.footer.informationHeading}</FooterColumnHeading>
            <nav className="flex flex-col gap-2.5" aria-label={t.footer.informationHeading}>
              {informationLinks.map((item) => (
                <FooterLink key={item.key} href={item.href}>
                  {t.footer[item.key]}
                </FooterLink>
              ))}
            </nav>
          </div>

          <div>
            <FooterColumnHeading>{t.footer.socialHeading}</FooterColumnHeading>
            <nav className="flex flex-col gap-2.5" aria-label={t.footer.socialHeading}>
              <Link
                href="/blog"
                className="flex items-center gap-2.5 text-sm text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
              >
                <SocialIcon type="guide" />
                {t.footer.arenaGuide}
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-2.5 text-sm text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
              >
                <SocialIcon type="mail" />
                {t.footer.contact}
              </Link>
              <Link
                href="/report"
                className="flex items-center gap-2.5 text-sm text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
              >
                <SocialIcon type="report" />
                {t.footer.reportContent}
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-800/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:text-zinc-600">
          <p dir="ltr" className="doodle-logo-ltr">
            {t.brand.name.toLowerCase()}.com
          </p>
          <p>{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
