"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { MobileHeader } from "@/components/MobileHeader";
import { AuthProvider } from "@/providers/AuthProvider";
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

export function Providers({ children }: ProvidersProps) {
  const pathname = usePathname();
  const authRoute = isAuthRoute(pathname);
  const adminRoute = isAdminRoute(pathname);

  return (
    <ThemeProvider>
      <LocaleProvider>
        <MaintenanceGate>
          <NavigationLoadingProvider>
          <AuthProvider>
            <StickersProvider>
              <VideoOverlayProvider>
            {authRoute || adminRoute ? (
              children
            ) : (
              <>
                <MobileHeader />
                <AppShell>{children}</AppShell>
              </>
            )}
              </VideoOverlayProvider>
            </StickersProvider>
          </AuthProvider>
          </NavigationLoadingProvider>
        </MaintenanceGate>
      </LocaleProvider>
    </ThemeProvider>
  );
}
