"use client";

import { usePathname } from "next/navigation";
import { AuthTopBar } from "@/components/AuthTopBar";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
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
  const { hasStarted } = useAnimeRadio();
  const reserveMiniBarSpace =
    hasStarted && pathname !== "/music" && !pathname.startsWith("/video/");

  return (
    <ProfileSectionProvider>
      <PageTitleProvider>
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
              className={`flex-1 ${isBlogPage ? "bg-zinc-950" : "bg-white dark:bg-black"} ${isVideoPage ? "overflow-hidden max-md:h-dvh max-md:min-h-0" : ""} ${
                reserveMiniBarSpace ? "pb-20 sm:pb-24" : ""
              }`}
            >
              {children}
            </main>
            {!isVideoPage && !isBlogPage && <Footer />}
          </div>
        </div>
      </PageTitleProvider>
    </ProfileSectionProvider>
  );
}
