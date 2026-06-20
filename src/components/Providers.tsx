"use client";

import { AppShell } from "@/components/AppShell";
import { MobileHeader } from "@/components/MobileHeader";
import { LocaleProvider } from "@/providers/LocaleProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <MobileHeader />
        <AppShell>{children}</AppShell>
      </LocaleProvider>
    </ThemeProvider>
  );
}
