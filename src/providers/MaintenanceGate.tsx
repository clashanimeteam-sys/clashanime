"use client";

import { MaintenanceScreen } from "@/components/MaintenanceScreen";
import { createBrowserClient } from "@/lib/supabase/client";
import { fetchPublicSiteFlags } from "@/lib/siteSettings";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";

type MaintenanceGateProps = {
  children: ReactNode;
};

function bypassesMaintenance(pathname: string) {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth/") ||
    pathname === "/login"
  );
}

export function MaintenanceGate({ children }: MaintenanceGateProps) {
  const pathname = usePathname();
  const supabase = useMemo(() => createBrowserClient(), []);
  const bypass = bypassesMaintenance(pathname);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    if (bypass || !supabase) return;

    let active = true;

    const refresh = () => {
      void fetchPublicSiteFlags(supabase).then((flags) => {
        if (active) setMaintenanceMode(flags.maintenanceMode);
      });
    };

    refresh();
    const interval = window.setInterval(refresh, 30_000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [bypass, supabase]);

  if (bypass) return children;
  if (maintenanceMode) return <MaintenanceScreen />;

  return children;
}
