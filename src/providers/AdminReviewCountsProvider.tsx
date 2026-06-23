"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useAdminReviewCounts } from "@/hooks/useAdminReviewCounts";
import type { AdminNavKey, AdminReviewCounts } from "@/lib/adminReviewCounts";

type AdminReviewCountsContextValue = {
  counts: AdminReviewCounts;
  loading: boolean;
  refresh: () => Promise<void>;
  getCountForNav: (key: AdminNavKey) => number;
};

const AdminReviewCountsContext = createContext<AdminReviewCountsContextValue | null>(null);

type AdminReviewCountsProviderProps = {
  enabled: boolean;
  children: ReactNode;
};

export function AdminReviewCountsProvider({ enabled, children }: AdminReviewCountsProviderProps) {
  const value = useAdminReviewCounts(enabled);

  return (
    <AdminReviewCountsContext.Provider value={value}>{children}</AdminReviewCountsContext.Provider>
  );
}

export function useAdminReviewCountsContext() {
  const context = useContext(AdminReviewCountsContext);
  if (!context) {
    throw new Error("useAdminReviewCountsContext must be used within AdminReviewCountsProvider");
  }
  return context;
}
