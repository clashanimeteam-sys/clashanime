"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, type ReactNode } from "react";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useLocale } from "@/providers/LocaleProvider";

type MobilePullToRefreshProps = {
  enabled: boolean;
  className?: string;
  children: ReactNode;
};

function RefreshIcon({ spinning }: { spinning: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={`h-5 w-5 text-orange-500 ${spinning ? "animate-spin" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M21 12a9 9 0 1 1-2.64-6.36"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M21 3v6h-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MobilePullToRefresh({
  enabled,
  className = "",
  children,
}: MobilePullToRefreshProps) {
  const router = useRouter();
  const { t } = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleRefresh = useCallback(async () => {
    router.refresh();
    window.dispatchEvent(new CustomEvent("clashanime:pull-refresh"));
    await new Promise((resolve) => window.setTimeout(resolve, 650));
  }, [router]);

  const { pullDistance, isRefreshing, isReady } = usePullToRefresh({
    scrollRef,
    enabled,
    onRefresh: handleRefresh,
  });

  const indicatorHeight = isRefreshing ? 48 : pullDistance;
  const showIndicator = enabled && indicatorHeight > 0;

  return (
    <div ref={scrollRef} className={className}>
      <div
        className={`flex items-end justify-center overflow-hidden md:hidden ${
          showIndicator ? "opacity-100" : "opacity-0"
        }`}
        style={{ height: showIndicator ? indicatorHeight : 0 }}
        aria-live="polite"
        aria-busy={isRefreshing}
      >
        <div className="flex items-center gap-2 pb-2 text-xs font-semibold text-orange-600 dark:text-orange-400">
          <RefreshIcon spinning={isRefreshing} />
          <span>
            {isRefreshing
              ? t.mobileApp.refreshing
              : isReady
                ? t.mobileApp.pullToRefreshRelease
                : t.mobileApp.pullToRefresh}
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}
