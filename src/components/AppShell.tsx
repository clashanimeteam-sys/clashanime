"use client";

import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex min-h-screen flex-1 flex-col bg-white dark:bg-black">
        <main className="flex-1 bg-white dark:bg-black">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
