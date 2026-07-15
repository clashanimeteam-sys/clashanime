"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getHilltopAdsPopunderUrl, isHilltopAdsEnabled } from "@/lib/hilltopads";

export function HilltopAdsPopunder() {
  const pathname = usePathname();
  const loaded = useRef(false);

  useEffect(() => {
    if (!isHilltopAdsEnabled()) return;
    if (
      pathname.startsWith("/admin") ||
      pathname === "/login" ||
      pathname === "/signup" ||
      pathname.startsWith("/auth/")
    ) {
      return;
    }

    const url = getHilltopAdsPopunderUrl();
    if (!url || loaded.current) return;
    loaded.current = true;

    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.referrerPolicy = "no-referrer-when-downgrade";
    document.body.appendChild(script);

    return () => {
      script.remove();
      loaded.current = false;
    };
  }, [pathname]);

  return null;
}
