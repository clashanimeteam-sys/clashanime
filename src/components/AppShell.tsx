"use client";

import { usePathname } from "next/navigation";
import { AuthTopBar } from "@/components/AuthTopBar";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { ProfileSectionProvider } from "@/providers/ProfileSectionProvider";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isVideoPage = pathname.startsWith("/video/");

  return (
    <ProfileSectionProvider>
      <div className="flex min-h-screen bg-white dark:bg-black">
        <div className="hidden md:flex">
          <Sidebar />
        </div>
        <div className="flex min-h-screen flex-1 flex-col bg-white dark:bg-black">
          <AuthTopBar />
          <main className={`flex-1 bg-white dark:bg-black ${isVideoPage ? "overflow-hidden" : ""}`}>
            {children}
          </main>
          {!isVideoPage && <Footer />}
        </div>
      </div>
    </ProfileSectionProvider>
  );
}
