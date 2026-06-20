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
import {
  fetchStickerCatalog,
  type AnimeSticker,
  type StickerPackWithStickers,
} from "@/lib/stickers";
import { createBrowserClient } from "@/lib/supabase/client";

type StickersContextValue = {
  catalog: StickerPackWithStickers[];
  stickerMap: Map<string, AnimeSticker>;
  loading: boolean;
  error: string | null;
  refreshStickers: () => Promise<void>;
};

const StickersContext = createContext<StickersContextValue | null>(null);

export function StickersProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createBrowserClient(), []);
  const [catalog, setCatalog] = useState<StickerPackWithStickers[]>([]);
  const [stickerMap, setStickerMap] = useState<Map<string, AnimeSticker>>(new Map());
  const [loading, setLoading] = useState(Boolean(supabase));
  const [error, setError] = useState<string | null>(null);

  const refreshStickers = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const next = await fetchStickerCatalog(supabase);
      setCatalog(next.catalog);
      setStickerMap(next.stickerMap);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load stickers.");
      setCatalog([]);
      setStickerMap(new Map());
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    void refreshStickers();
  }, [refreshStickers]);

  const value = useMemo(
    () => ({
      catalog,
      stickerMap,
      loading,
      error,
      refreshStickers,
    }),
    [catalog, stickerMap, loading, error, refreshStickers],
  );

  return <StickersContext.Provider value={value}>{children}</StickersContext.Provider>;
}

export function useStickers() {
  const context = useContext(StickersContext);
  if (!context) {
    throw new Error("useStickers must be used within StickersProvider");
  }
  return context;
}
