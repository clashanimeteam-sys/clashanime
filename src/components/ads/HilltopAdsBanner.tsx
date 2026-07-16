"use client";

import { useEffect, useRef } from "react";

type HilltopAdsBannerProps = {
  scriptUrl: string;
  className?: string;
};

type HilltopScript = HTMLScriptElement & { settings?: Record<string, unknown> };

/** Hilltop MultiTag Banner 300×250. */
export function HilltopAdsBanner({ scriptUrl, className = "" }: HilltopAdsBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const url = scriptUrl.trim();
    if (!container || !url || loaded.current) return;
    loaded.current = true;

    const script = document.createElement("script") as HilltopScript;
    script.settings = {};
    script.src = url;
    script.async = true;
    script.referrerPolicy = "no-referrer-when-downgrade";
    container.appendChild(script);

    return () => {
      script.remove();
      loaded.current = false;
    };
  }, [scriptUrl]);

  if (!scriptUrl.trim()) return null;

  return (
    <div
      ref={containerRef}
      className={`mx-auto flex min-h-[250px] w-full max-w-[300px] items-center justify-center overflow-hidden ${className}`.trim()}
      aria-label="Advertisement"
    />
  );
}
