"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const PULL_THRESHOLD = 72;
const MAX_PULL = 120;
const PULL_RESISTANCE = 0.45;

type UsePullToRefreshOptions = {
  scrollRef: React.RefObject<HTMLElement | null>;
  enabled?: boolean;
  onRefresh: () => Promise<void> | void;
};

export function usePullToRefresh({
  scrollRef,
  enabled = true,
  onRefresh,
}: UsePullToRefreshOptions) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pullDistanceRef = useRef(0);
  const isRefreshingRef = useRef(false);
  const onRefreshRef = useRef(onRefresh);

  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  useEffect(() => {
    isRefreshingRef.current = isRefreshing;
  }, [isRefreshing]);

  const resetPull = useCallback((distance = 0) => {
    pullDistanceRef.current = distance;
    setPullDistance(distance);
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element || !enabled) return;

    let startY = 0;
    let pulling = false;

    const handleTouchStart = (event: TouchEvent) => {
      if (isRefreshingRef.current) return;
      if (element.scrollTop > 0) return;

      startY = event.touches[0]?.clientY ?? 0;
      pulling = true;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!pulling || isRefreshingRef.current) return;

      if (element.scrollTop > 0) {
        pulling = false;
        resetPull();
        return;
      }

      const currentY = event.touches[0]?.clientY ?? startY;
      const delta = currentY - startY;

      if (delta <= 0) {
        resetPull();
        return;
      }

      event.preventDefault();
      const nextDistance = Math.min(delta * PULL_RESISTANCE, MAX_PULL);
      resetPull(nextDistance);
    };

    const handleTouchEnd = async () => {
      if (!pulling) return;
      pulling = false;

      const distance = pullDistanceRef.current;
      if (distance < PULL_THRESHOLD || isRefreshingRef.current) {
        resetPull();
        return;
      }

      isRefreshingRef.current = true;
      setIsRefreshing(true);
      resetPull(PULL_THRESHOLD);

      try {
        await onRefreshRef.current();
      } finally {
        isRefreshingRef.current = false;
        setIsRefreshing(false);
        resetPull();
      }
    };

    const handleTouchCancel = () => {
      pulling = false;
      if (!isRefreshingRef.current) {
        resetPull();
      }
    };

    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    element.addEventListener("touchend", handleTouchEnd);
    element.addEventListener("touchcancel", handleTouchCancel);

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
      element.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, [enabled, resetPull, scrollRef]);

  return {
    pullDistance,
    isRefreshing,
    isReady: pullDistance >= PULL_THRESHOLD,
    pullThreshold: PULL_THRESHOLD,
  };
}
