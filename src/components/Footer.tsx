"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { communicationLinks, informationLinks } from "@/lib/siteLinks";
import { useLocale } from "@/providers/LocaleProvider";

const discoverLinks = [
  { key: "clash" as const, href: "/" },
  { key: "videos" as const, href: "/videos" },
  { key: "community" as const, href: "/community" },
  { key: "music" as const, href: "/music" },
  { key: "exclusives" as const, href: "/exclusives" },
  { key: "animeTracker" as const, href: "/tracker" },
] as const;

function FooterColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400 md:mb-4 dark:text-zinc-500">
      {children}
    </p>
  );
}

function FooterLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`block text-xs leading-snug text-zinc-600 transition-colors hover:text-black md:text-sm dark:text-zinc-400 dark:hover:text-white ${className}`}
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
    <footer className="mt-auto border-t border-zinc-800/80 bg-black/70 text-zinc-300 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:py-14">
        <div className="grid gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-4 lg:gap-8">
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex flex-col gap-3">
              <BrandLogo className="h-12 w-12 md:h-14 md:w-14" />
              <p
                dir="ltr"
                className="doodle-logo-ltr font-display text-lg font-black uppercase italic leading-none tracking-[0.14em]"
              >
                <span className="bg-gradient-to-br from-brand via-red-600 to-orange-500 bg-clip-text text-transparent">
                  {t.home.titlePrimary}
                </span>
                <span className="text-white">{t.home.titleSecondary}</span>
              </p>
            </Link>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-zinc-500 md:mt-4 md:text-sm">
              {t.footer.tagline}
            </p>
          </div>

          <div className="hidden md:block">
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
            <FooterColumnHeading>
              <Link href="/legal" className="transition-colors hover:text-zinc-600 dark:hover:text-zinc-300">
                {t.footer.informationHeading}
              </Link>
            </FooterColumnHeading>
            <nav
              className="grid grid-cols-2 gap-x-3 gap-y-2.5 md:flex md:flex-col md:gap-2.5"
              aria-label={t.footer.informationHeading}
            >
              <FooterLink href="/legal">{t.legalHub.viewAll}</FooterLink>
              {informationLinks.map((item) => (
                <FooterLink key={item.key} href={item.href}>
                  {t.footer[item.key]}
                </FooterLink>
              ))}
            </nav>
          </div>

          <div>
            <FooterColumnHeading>
              <Link
                href="/legal#legal-hub-communication"
                className="transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                {t.footer.socialHeading}
              </Link>
            </FooterColumnHeading>
            <nav
              className="grid grid-cols-3 gap-2 md:flex md:flex-col md:gap-2.5"
              aria-label={t.footer.socialHeading}
            >
              {communicationLinks.map((item) => (
                <Link
                  key={`${item.href}-${item.key}`}
                  href={item.href}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-zinc-200/80 bg-zinc-50 px-1.5 py-2.5 text-center text-[10px] font-medium leading-tight text-zinc-600 transition-colors hover:border-accent/30 hover:text-black md:flex-row md:items-center md:gap-2.5 md:rounded-none md:border-0 md:bg-transparent md:px-0 md:py-0 md:text-start md:text-sm md:font-normal dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:text-white md:dark:bg-transparent"
                >
                  <SocialIcon type={item.icon} />
                  <span>{t.footer[item.key]}</span>
                </Link>
              ))}
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
