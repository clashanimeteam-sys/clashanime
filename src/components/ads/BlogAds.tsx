"use client";

type BlogAdsProps = {
  className?: string;
  variant?: "top" | "mid" | "bottom" | "between" | "rectangle";
};

/**
 * AdSense placements removed from Heroes Guide.
 * Kept as a no-op so existing imports compile without showing units.
 */
export function BlogAds(_props: BlogAdsProps) {
  return null;
}
