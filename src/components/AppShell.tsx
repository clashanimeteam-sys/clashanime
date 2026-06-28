"use client";

import { usePathname } from "next/navigation";
import { AdSenseScript } from "@/components/ads/AdSenseScript";
import { AuthTopBar } from "@/components/AuthTopBar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Sidebar } from "@/components/Sidebar";
import { SiteAdBanner } from "@/components/ads/SiteAdBanner";
import { PageTitleProvider } from "@/providers/PageTitleProvider";
import { ProfileSectionProvider } from "@/providers/ProfileSectionProvider";
import { useAnimeRadio } from "@/providers/AnimeRadioProvider";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isVideoPage = pathname.startsWith("/video/");
  const isBlogPage = pathname.startsWith("/blog");
  const showMobileChrome = !isVideoPage && !isBlogPage;
  const { hasStarted } = useAnimeRadio();
  const reserveMiniBarSpace =
    hasStarted && pathname !== "/music" && !pathname.startsWith("/video/");

  const mainBottomPadding = showMobileChrome
    ? reserveMiniBarSpace
      ? "pb-36 sm:pb-40"
      : "pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))]"
    : reserveMiniBarSpace
      ? "pb-20 sm:pb-24"
      : "";

  return (
    <ProfileSectionProvider>
      <PageTitleProvider>
        <AdSenseScript />
        <div className="flex h-dvh overflow-hidden bg-white dark:bg-black">
          {!isBlogPage ? (
            <div className="hidden h-dvh shrink-0 md:flex">
              <Sidebar />
            </div>
          ) : null}
          <div
            className={`flex min-h-0 flex-1 flex-col bg-white dark:bg-black ${
              isVideoPage ? "max-md:h-dvh max-md:overflow-hidden md:overflow-y-auto" : "overflow-y-auto"
            }`}
          >
            <div className={isVideoPage || isBlogPage ? "hidden md:block" : ""}>
              {!isBlogPage ? <AuthTopBar /> : null}
            </div>
            <main
              className={`flex-1 ${isBlogPage ? "bg-zinc-950" : "bg-white dark:bg-black"} ${isVideoPage ? "overflow-hidden max-md:h-dvh max-md:min-h-0" : ""} ${mainBottomPadding}`}
            >
              {children}
            </main>
            {!isVideoPage && !isBlogPage ? (
              <>
                <SiteAdBanner placement="desktop-inline" />
                <SiteAdBanner placement="mobile-footer" />
                <Footer />
              </>
            ) : null}
          </div>
        </div>
        {showMobileChrome ? <MobileBottomNav /> : null}
      </PageTitleProvider>
    </ProfileSectionProvider>
  );
}
