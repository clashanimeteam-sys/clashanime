"use client";

import { useEffect, useRef } from "react";

type HilltopAdsVideoSliderProps = {
  scriptUrl: string;
};

type HilltopScript = HTMLScriptElement & { settings?: Record<string, unknown> };

/** Hilltop MultiTag Video Slider (fixed corner unit). */
export function HilltopAdsVideoSlider({ scriptUrl }: HilltopAdsVideoSliderProps) {
  const loaded = useRef(false);

  useEffect(() => {
    const url = scriptUrl.trim();
    if (!url || loaded.current) return;
    loaded.current = true;

    const script = document.createElement("script") as HilltopScript;
    script.settings = {};
    script.src = url;
    script.async = true;
    script.referrerPolicy = "no-referrer-when-downgrade";
    document.body.appendChild(script);

    return () => {
      script.remove();
      loaded.current = false;
    };
  }, [scriptUrl]);

  return null;
}
