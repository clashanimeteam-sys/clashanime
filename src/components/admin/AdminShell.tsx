"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { LocaleFlags } from "@/components/LocaleFlags";
import { ThemeToggle } from "@/components/ThemeToggleLazy";
import { AdminNavBadge } from "@/components/admin/AdminNavBadge";
import { PageBackLink } from "@/components/PageBackLink";
import { isAdmin, isStaff } from "@/lib/admin";
import type { AdminNavKey } from "@/lib/adminReviewCounts";
import { AdminReviewCountsProvider, useAdminReviewCountsContext } from "@/providers/AdminReviewCountsProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

const navItems: Array<{
  key: AdminNavKey;
  href: string;
  adminOnly?: boolean;
}> = [
  { key: "dashboard", href: "/admin" },
  { key: "users", href: "/admin/users", adminOnly: true },
  { key: "videos", href: "/admin/videos" },
  { key: "community", href: "/admin/community" },
  { key: "stickers", href: "/admin/stickers", adminOnly: true },
  { key: "reports", href: "/admin/reports" },
  { key: "kyc", href: "/admin/kyc" },
  { key: "contact", href: "/admin/contact" },
  { key: "emails", href: "/admin/emails" },
  { key: "referrals", href: "/admin/referrals", adminOnly: true },
  { key: "broadcast", href: "/admin/broadcast", adminOnly: true },
  { key: "seasons", href: "/admin/seasons" },
  { key: "legends", href: "/admin/legends" },
  { key: "beatsLounge", href: "/admin/beats-lounge" },
  { key: "animeTracker", href: "/admin/anime-tracker" },
  { key: "blog", href: "/admin/blog" },
  { key: "animeNews", href: "/admin/anime-news" },
  { key: "withdrawals", href: "/admin/withdrawals" },
  { key: "moderationLog", href: "/admin/moderation-log" },
  { key: "settings", href: "/admin/settings", adminOnly: true },
];

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading, profileReady, signOut } = useAuth();
  const { t } = useLocale();

  const bootstrapping = loading || (Boolean(user) && !profileReady);
  const allowed = Boolean(user && profileReady && isStaff(profile));

  useEffect(() => {
    if (bootstrapping) return;

    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/admin")}`);
      return;
    }

    if (!isStaff(profile)) {
      router.replace("/?admin_denied=1");
    }
  }, [bootstrapping, user, profile, router, pathname]);

  useEffect(() => {
    if (!allowed || !pathname.startsWith("/admin")) return;
    sessionStorage.setItem("admin:last-path", pathname);
  }, [allowed, pathname]);

  useEffect(() => {
    if (!allowed) return;

    const handlePopState = () => {
      window.setTimeout(() => {
        const path = window.location.pathname;
        if (!path.startsWith("/admin")) {
          const lastAdminPath = sessionStorage.getItem("admin:last-path") || "/admin";
          router.replace(lastAdminPath);
        }
      }, 0);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [allowed, router]);

  if (bootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-300">
        {t.admin.loading}
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-4 text-center text-zinc-300">
        <p className="max-w-md text-sm">{t.admin.accessDenied}</p>
        {profile ? (
          <p className="max-w-md text-xs text-zinc-500">
            @{profile.username} · role: {profile.role ?? "user"}
          </p>
        ) : null}
        <Link
          href="/"
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          {t.admin.backToSite}
        </Link>
      </div>
    );
  }

  const adminUser = isAdmin(profile);
  const showDashboardBack = pathname !== "/admin";

  return (
    <AdminReviewCountsProvider enabled={allowed}>
      <AdminShellLayout
        adminUser={adminUser}
        pathname={pathname}
        profile={profile}
        showDashboardBack={showDashboardBack}
        signOut={signOut}
      >
        {children}
      </AdminShellLayout>
    </AdminReviewCountsProvider>
  );
}

type AdminShellLayoutProps = {
  children: React.ReactNode;
  adminUser: boolean;
  pathname: string;
  profile: ReturnType<typeof useAuth>["profile"];
  showDashboardBack: boolean;
  signOut: () => Promise<void>;
};

function AdminShellLayout({
  children,
  adminUser,
  pathname,
  profile,
  showDashboardBack,
  signOut,
}: AdminShellLayoutProps) {
  const { t } = useLocale();
  const { getCountForNav, refresh } = useAdminReviewCountsContext();

  useEffect(() => {
    void refresh();
  }, [pathname, refresh]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-e border-zinc-800 bg-black lg:flex lg:flex-col">
          <div className="border-b border-zinc-800 p-5">
            <Link href="/" className="flex justify-center">
              <BrandLogo priority />
            </Link>
            <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {t.admin.panelTitle}
            </p>
          </div>

          <nav className="flex flex-1 flex-col gap-1 p-3">
            {navItems
              .filter((item) => !item.adminOnly || adminUser)
              .map((item) => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                const reviewCount = getCountForNav(item.key);

                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-accent/15 text-accent"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    }`}
                  >
                    <span>{t.admin.nav[item.key]}</span>
                    <AdminNavBadge count={reviewCount} />
                  </Link>
                );
              })}
          </nav>

          <div className="space-y-2 border-t border-zinc-800 p-3">
            <Link
              href="/"
              className="block rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
            >
              {t.admin.backToSite}
            </Link>
            <button
              type="button"
              onClick={() => signOut()}
              className="w-full rounded-lg px-3 py-2 text-start text-sm text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
            >
              {t.auth.signOut}
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 bg-black px-4 py-4 sm:px-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{t.admin.panelTitle}</p>
              <p className="flex items-center gap-2 text-sm text-zinc-300">
                <span>
                  {profile?.display_name ?? profile?.username} ·{" "}
                  {profile?.role === "admin" ? t.admin.roles.admin : t.admin.roles.moderator}
                </span>
                <AdminNavBadge count={getCountForNav("dashboard")} />
              </p>
            </div>

            <nav className="flex flex-wrap gap-2 lg:hidden">
              {navItems
                .filter((item) => !item.adminOnly || adminUser)
                .map((item) => {
                  const reviewCount = getCountForNav(item.key);
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300"
                    >
                      <span>{t.admin.nav[item.key]}</span>
                      <AdminNavBadge count={reviewCount} />
                    </Link>
                  );
                })}
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <LocaleFlags />
              <ThemeToggle />
              <Link
                href="/"
                className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-zinc-500"
              >
                {t.admin.backToSite}
              </Link>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6">
            {showDashboardBack ? (
              <PageBackLink
                href="/admin"
                label={t.admin.nav.dashboard}
                className="mb-5 text-accent hover:text-accent"
              />
            ) : null}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
