"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_AD_PLACEMENTS,
  parseAdPlacementSettings,
  type AdPlacementSettings,
} from "@/lib/ads/placements";

let cachedSettings: AdPlacementSettings | null = null;
let inflight: Promise<AdPlacementSettings> | null = null;

async function fetchAdPlacementSettings(): Promise<AdPlacementSettings> {
  if (cachedSettings) return cachedSettings;
  if (inflight) return inflight;

  inflight = fetch("/api/ads/placements", { cache: "no-store" })
    .then(async (response) => {
      if (!response.ok) {
        return parseAdPlacementSettings(DEFAULT_AD_PLACEMENTS);
      }
      const payload = (await response.json()) as { settings?: AdPlacementSettings };
      return parseAdPlacementSettings(payload.settings ?? DEFAULT_AD_PLACEMENTS);
    })
    .catch(() => parseAdPlacementSettings(DEFAULT_AD_PLACEMENTS))
    .finally(() => {
      inflight = null;
    });

  cachedSettings = await inflight;
  return cachedSettings;
}

export function useAdPlacements() {
  const [settings, setSettings] = useState<AdPlacementSettings>(
    cachedSettings ?? parseAdPlacementSettings(DEFAULT_AD_PLACEMENTS),
  );
  const [loading, setLoading] = useState(!cachedSettings);

  useEffect(() => {
    let cancelled = false;

    void fetchAdPlacementSettings().then((next) => {
      if (!cancelled) {
        setSettings(next);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { settings, loading };
}

export function invalidateAdPlacementsCache() {
  cachedSettings = null;
}
