"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { DOTLOTTIE_SCRIPT, DOTLOTTIE_SIZE } from "@/lib/dotlottie";

type DotLottiePlayerProps = {
  src: string;
  size?: string;
  className?: string;
};

export function DotLottiePlayer({
  src,
  size = DOTLOTTIE_SIZE,
  className,
}: DotLottiePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (customElements.get("dotlottie-wc")) {
      setScriptReady(true);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!scriptReady || !container) return;

    const player = document.createElement("dotlottie-wc");
    player.setAttribute("src", src);
    player.setAttribute("autoplay", "");
    player.setAttribute("loop", "");
    player.style.width = size;
    player.style.height = size;
    container.replaceChildren(player);

    return () => {
      container.replaceChildren();
    };
  }, [scriptReady, size, src]);

  return (
    <>
      <Script
        id="dotlottie-wc"
        src={DOTLOTTIE_SCRIPT}
        type="module"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <div ref={containerRef} className={className}>
        {!scriptReady ? (
          <div
            className="animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800"
            style={{ width: size, height: size }}
          />
        ) : null}
      </div>
    </>
  );
}
