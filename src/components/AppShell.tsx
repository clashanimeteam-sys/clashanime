"use client";

import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex min-h-screen flex-1 flex-col">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
