"use client";

import { useEffect, useRef } from "react";
import { normalizeTrafficStarsScriptUrl } from "@/lib/trafficstars";

type TrafficStarsPopunderProps = {
  scriptUrl: string;
};

export function TrafficStarsPopunder({ scriptUrl }: TrafficStarsPopunderProps) {
  const loaded = useRef(false);

  useEffect(() => {
    const url = normalizeTrafficStarsScriptUrl(scriptUrl);
    if (!url || loaded.current) return;
    loaded.current = true;

    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
      loaded.current = false;
    };
  }, [scriptUrl]);

  return null;
}
