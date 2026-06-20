"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { MobileHeader } from "@/components/MobileHeader";
import { AuthProvider } from "@/providers/AuthProvider";
import { LocaleProvider } from "@/providers/LocaleProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

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

export function Providers({ children }: ProvidersProps) {
  const pathname = usePathname();
  const authRoute = isAuthRoute(pathname);

  return (
    <ThemeProvider>
      <LocaleProvider>
        <AuthProvider>
          {authRoute ? (
            children
          ) : (
            <>
              <MobileHeader />
              <AppShell>{children}</AppShell>
            </>
          )}
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
