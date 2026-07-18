"use client";

import { usePathname } from "next/navigation";
import { AuthTopBar } from "@/components/AuthTopBar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/mobile/MobileChromeLazy";
import { MobilePullToRefresh } from "@/components/mobile/MobilePullToRefresh";
import { Sidebar, SidebarRail } from "@/components/Sidebar";
import { useIsMobile } from "@/hooks/useIsMobile";
import { PageTitleProvider } from "@/providers/PageTitleProvider";
import { ProfileSectionProvider } from "@/providers/ProfileSectionProvider";
import { SidebarProvider, useSidebar } from "@/providers/SidebarProvider";
import { useAnimeRadio } from "@/providers/AnimeRadioProvider";

type AppShellProps = {
  children: React.ReactNode;
};

function AppShellLayout({ children }: AppShellProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const isVideoPage = pathname.startsWith("/video/");
  const isBlogPage = pathname.startsWith("/blog");
  const isWatchPage = pathname === "/watch";
  const showMobileChrome = !isVideoPage && !isBlogPage && !isWatchPage;
  const { hasStarted } = useAnimeRadio();
  const { desktopCollapsed } = useSidebar();
  const reserveMiniBarSpace =
    hasStarted && pathname !== "/music" && !pathname.startsWith("/video/");

  const mainBottomPadding = showMobileChrome
    ? reserveMiniBarSpace
      ? "pb-40 sm:pb-44"
      : "pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))]"
    : reserveMiniBarSpace
      ? "pb-20 sm:pb-24"
      : "";

  const scrollClassName = `flex min-h-0 flex-1 flex-col bg-white dark:bg-black max-md:overflow-x-hidden max-md:max-w-full ${
    isVideoPage ? "max-md:h-dvh max-md:overflow-hidden md:overflow-y-auto" : "overflow-y-auto"
  }`;

  return (
    <>
      <div className="flex h-dvh overflow-hidden bg-white dark:bg-black">
        {!isBlogPage && !isMobile ? (
          <div className="hidden h-dvh shrink-0 md:flex">
            {desktopCollapsed ? <SidebarRail /> : <Sidebar />}
          </div>
        ) : null}
        <MobilePullToRefresh
          enabled={showMobileChrome && isMobile}
          className={scrollClassName}
        >
          {!isVideoPage && !isBlogPage && !isWatchPage ? (
            <div className="hidden md:block">
              <AuthTopBar />
            </div>
          ) : null}
          <main
            className={`mobile-app-main flex-1 max-md:overflow-x-hidden max-md:max-w-full ${isBlogPage ? "bg-zinc-950" : isWatchPage ? "bg-black" : "bg-white dark:bg-black"} ${isVideoPage || isWatchPage ? "overflow-hidden max-md:h-dvh max-md:min-h-0 md:min-h-0 md:h-full" : ""} ${isWatchPage ? "relative p-0" : ""} ${mainBottomPadding}`}
          >
            {children}
          </main>
          {!isVideoPage && !isBlogPage && !isWatchPage ? (
            <div className="hidden md:block">
              <Footer />
            </div>
          ) : null}
        </MobilePullToRefresh>
      </div>
      {showMobileChrome ? <MobileBottomNav /> : null}
    </>
  );
}

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider>
      <ProfileSectionProvider>
        <PageTitleProvider>
          <AppShellLayout>{children}</AppShellLayout>
        </PageTitleProvider>
      </ProfileSectionProvider>
    </SidebarProvider>
  );
}
