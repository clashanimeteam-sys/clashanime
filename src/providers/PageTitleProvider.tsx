"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type PageTitleContextValue = {
  title: string | null;
  setTitle: (title: string | null) => void;
};

const PageTitleContext = createContext<PageTitleContextValue | null>(null);

export function PageTitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string | null>(null);
  const value = useMemo(() => ({ title, setTitle }), [title]);

  return <PageTitleContext.Provider value={value}>{children}</PageTitleContext.Provider>;
}

export function usePageTitleContext() {
  const context = useContext(PageTitleContext);
  if (!context) {
    throw new Error("usePageTitleContext must be used within PageTitleProvider");
  }
  return context;
}

/** Registers the current page title in the top bar corner. Clears on unmount. */
export function usePageTitle(title: string | null) {
  const context = useContext(PageTitleContext);

  useEffect(() => {
    if (!context) return;
    context.setTitle(title);
    return () => context.setTitle(null);
  }, [title, context]);
}
