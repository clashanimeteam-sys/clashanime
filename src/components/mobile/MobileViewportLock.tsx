"use client";

import { useEffect } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

function blockGesture(event: Event) {
  event.preventDefault();
}

export function MobileViewportLock() {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) return;

    const options: AddEventListenerOptions = { passive: false };

    document.addEventListener("gesturestart", blockGesture, options);
    document.addEventListener("gesturechange", blockGesture, options);
    document.addEventListener("gestureend", blockGesture, options);

    return () => {
      document.removeEventListener("gesturestart", blockGesture);
      document.removeEventListener("gesturechange", blockGesture);
      document.removeEventListener("gestureend", blockGesture);
    };
  }, [isMobile]);

  return null;
}
