"use client";

import { PageLoadingLottie } from "@/components/PageLoadingLottie";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

const SHOW_DELAY_MS = 350;

type NavigationLoadingProviderProps = {
  children: ReactNode;
};

function isInternalNavigation(href: string, pathname: string) {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }

  try {
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return false;
    return `${url.pathname}${url.search}` !== `${pathname}${window.location.search}`;
  } catch {
    return false;
  }
}

export function NavigationLoadingProvider({ children }: NavigationLoadingProviderProps) {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setPending(false);
    setVisible(false);
  }, [pathname]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || !isInternalNavigation(href, pathname)) return;

      setPending(true);
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname]);

  useEffect(() => {
    if (!pending) {
      setVisible(false);
      return;
    }

    const timer = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [pending]);

  useEffect(() => {
    if (document.readyState === "complete") return;

    setPending(true);
    function handleLoad() {
      setPending(false);
    }

    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return (
    <>
      {children}
      <PageLoadingLottie show={visible} />
    </>
  );
}
