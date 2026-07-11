"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const DESKTOP_COLLAPSED_KEY = "clash-sidebar-collapsed";

type SidebarContextValue = {
  desktopCollapsed: boolean;
  setDesktopCollapsed: (collapsed: boolean) => void;
  toggleDesktop: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

function readDesktopCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(DESKTOP_COLLAPSED_KEY) === "1";
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [desktopCollapsed, setDesktopCollapsedState] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDesktopCollapsedState(readDesktopCollapsed());
    setHydrated(true);
  }, []);

  const setDesktopCollapsed = useCallback((collapsed: boolean) => {
    setDesktopCollapsedState(collapsed);
    window.localStorage.setItem(DESKTOP_COLLAPSED_KEY, collapsed ? "1" : "0");
  }, []);

  const toggleDesktop = useCallback(() => {
    setDesktopCollapsedState((current) => {
      const next = !current;
      window.localStorage.setItem(DESKTOP_COLLAPSED_KEY, next ? "1" : "0");
      return next;
    });
  }, []);

  const value = useMemo<SidebarContextValue>(
    () => ({
      desktopCollapsed: hydrated ? desktopCollapsed : false,
      setDesktopCollapsed,
      toggleDesktop,
    }),
    [desktopCollapsed, hydrated, setDesktopCollapsed, toggleDesktop],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}
