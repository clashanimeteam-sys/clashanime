"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ADMIN_REVIEW_COUNTS_EVENT,
  EMPTY_ADMIN_REVIEW_COUNTS,
  fetchAdminReviewCounts,
  getNavReviewCount,
  type AdminNavKey,
  type AdminReviewCounts,
} from "@/lib/adminReviewCounts";
import { createBrowserClient } from "@/lib/supabase/client";

export function useAdminReviewCounts(enabled: boolean) {
  const supabase = useMemo(() => createBrowserClient(), []);
  const [counts, setCounts] = useState<AdminReviewCounts>(EMPTY_ADMIN_REVIEW_COUNTS);
  const [loading, setLoading] = useState(enabled);

  const refresh = useCallback(async () => {
    if (!supabase || !enabled) return;
    const next = await fetchAdminReviewCounts(supabase);
    setCounts(next);
    setLoading(false);
  }, [enabled, supabase]);

  useEffect(() => {
    if (!enabled) return;

    void refresh();

    const interval = window.setInterval(() => {
      void refresh();
    }, 30_000);

    const onEvent = () => {
      void refresh();
    };
    const onFocus = () => {
      void refresh();
    };

    window.addEventListener(ADMIN_REVIEW_COUNTS_EVENT, onEvent);
    window.addEventListener("focus", onFocus);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener(ADMIN_REVIEW_COUNTS_EVENT, onEvent);
      window.removeEventListener("focus", onFocus);
    };
  }, [enabled, refresh]);

  const getCountForNav = useCallback(
    (key: AdminNavKey) => getNavReviewCount(key, counts),
    [counts],
  );

  return { counts, loading, refresh, getCountForNav };
}
