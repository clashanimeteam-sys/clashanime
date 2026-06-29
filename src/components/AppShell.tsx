"use client";

import { usePathname } from "next/navigation";
import { AuthTopBar } from "@/components/AuthTopBar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/mobile/MobileChromeLazy";
import { Sidebar } from "@/components/Sidebar";
import { useIsMobile } from "@/hooks/useIsMobile";
import { PageTitleProvider } from "@/providers/PageTitleProvider";
import { ProfileSectionProvider } from "@/providers/ProfileSectionProvider";
import { useAnimeRadio } from "@/providers/AnimeRadioProvider";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const isVideoPage = pathname.startsWith("/video/");
  const isBlogPage = pathname.startsWith("/blog");
  const showMobileChrome = !isVideoPage && !isBlogPage;
  const { hasStarted } = useAnimeRadio();
  const reserveMiniBarSpace =
    hasStarted && pathname !== "/music" && !pathname.startsWith("/video/");

  const mainBottomPadding = showMobileChrome
    ? reserveMiniBarSpace
      ? "pb-40 sm:pb-44"
      : "pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))]"
    : reserveMiniBarSpace
      ? "pb-20 sm:pb-24"
      : "";

  return (
    <ProfileSectionProvider>
      <PageTitleProvider>
        <div className="flex h-dvh overflow-hidden bg-white dark:bg-black">
          {!isBlogPage && !isMobile ? (
            <div className="hidden h-dvh shrink-0 md:flex">
              <Sidebar />
            </div>
          ) : null}
          <div
            className={`flex min-h-0 flex-1 flex-col bg-white dark:bg-black ${
              isVideoPage ? "max-md:h-dvh max-md:overflow-hidden md:overflow-y-auto" : "overflow-y-auto"
            }`}
          >
            {!isVideoPage && !isBlogPage ? (
              <div className="hidden md:block">
                <AuthTopBar />
              </div>
            ) : null}
            <main
              className={`mobile-app-main flex-1 ${isBlogPage ? "bg-zinc-950" : "bg-white dark:bg-black"} ${isVideoPage ? "overflow-hidden max-md:h-dvh max-md:min-h-0" : ""} ${mainBottomPadding}`}
            >
              {children}
            </main>
            {!isVideoPage && !isBlogPage ? <Footer /> : null}
          </div>
        </div>
        {showMobileChrome ? <MobileBottomNav /> : null}
      </PageTitleProvider>
    </ProfileSectionProvider>
  );
}
