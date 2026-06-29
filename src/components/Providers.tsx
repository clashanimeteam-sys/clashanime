"use client";

import { usePathname } from "next/navigation";
import { AnimeRadioMiniBar } from "@/components/AnimeRadioMiniBar";
import { BeatsLoungeMiniBar } from "@/components/lounge/BeatsLoungeMiniBar";
import { AnimeRadioController } from "@/components/radio/AnimeRadioController";
import { AppShell } from "@/components/AppShell";
import { MobileAppHeader, MobileBottomNav, MobileInstallPrompt, MobileViewportLock } from "@/components/mobile/MobileChromeLazy";
import { AuthProvider } from "@/providers/AuthProvider";
import { BeatsLoungeProvider } from "@/providers/BeatsLoungeProvider";
import { PointsWagerNotificationProvider } from "@/providers/PointsWagerNotificationProvider";
import { AnimeRadioProvider } from "@/providers/AnimeRadioProvider";
import { LocaleProvider } from "@/providers/LocaleProvider";
import { MaintenanceGate } from "@/providers/MaintenanceGate";
import { NavigationLoadingProvider } from "@/providers/NavigationLoadingProvider";
import { StickersProvider } from "@/providers/StickersProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { VideoOverlayProvider } from "@/providers/VideoOverlayProvider";

type ProvidersProps = {
  children: React.ReactNode;
};

function isAuthRoute(pathname: string) {
  return (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/auth/")
  );
}

function isAdminRoute(pathname: string) {
  return pathname.startsWith("/admin");
}

function RadioOrLoungeMiniBar() {
  return (
    <>
      <AnimeRadioMiniBar />
      <BeatsLoungeMiniBar />
    </>
  );
}

function isVideoRoute(pathname: string) {
  return pathname.startsWith("/video/");
}

export function Providers({ children }: ProvidersProps) {
  const pathname = usePathname();
  const authRoute = isAuthRoute(pathname);
  const adminRoute = isAdminRoute(pathname);
  const videoRoute = isVideoRoute(pathname);

  return (
    <ThemeProvider>
      <LocaleProvider>
        <MaintenanceGate>
          <NavigationLoadingProvider>
            <AuthProvider>
              <PointsWagerNotificationProvider>
                <AnimeRadioProvider>
                  <BeatsLoungeProvider>
                    <StickersProvider>
                      <VideoOverlayProvider>
                        {authRoute || adminRoute ? (
                          children
                        ) : (
                          <>
                            {!videoRoute ? <MobileAppHeader /> : null}
                            <MobileViewportLock />
                            <AppShell>{children}</AppShell>
                            {!videoRoute ? <MobileInstallPrompt /> : null}
                            <AnimeRadioController />
                            <RadioOrLoungeMiniBar />
                          </>
                        )}
                      </VideoOverlayProvider>
                    </StickersProvider>
                  </BeatsLoungeProvider>
                </AnimeRadioProvider>
              </PointsWagerNotificationProvider>
            </AuthProvider>
          </NavigationLoadingProvider>
        </MaintenanceGate>
      </LocaleProvider>
    </ThemeProvider>
  );
}
