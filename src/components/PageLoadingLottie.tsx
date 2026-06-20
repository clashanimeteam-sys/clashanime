"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const DOTLOTTIE_SCRIPT =
  "https://unpkg.com/@lottiefiles/dotlottie-wc@0.9.14/dist/dotlottie-wc.js";
const LOTTIE_SRC =
  "https://lottie.host/b1b5b12f-3bef-47d3-b193-15f7b7f7370b/bgVULaRa5q.lottie";

const LOTTIE_SIZE = "min(88vw, 72vh, 720px)";

type PageLoadingLottieProps = {
  show?: boolean;
};

export function PageLoadingLottie({ show = true }: PageLoadingLottieProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (customElements.get("dotlottie-wc")) {
      setScriptReady(true);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!show || !scriptReady || !container) return;

    const player = document.createElement("dotlottie-wc");
    player.setAttribute("src", LOTTIE_SRC);
    player.setAttribute("autoplay", "");
    player.setAttribute("loop", "");
    player.style.width = LOTTIE_SIZE;
    player.style.height = LOTTIE_SIZE;
    container.replaceChildren(player);

    return () => {
      container.replaceChildren();
    };
  }, [show, scriptReady]);

  if (!show) return null;

  return (
    <>
      <Script
        id="dotlottie-wc"
        src={DOTLOTTIE_SCRIPT}
        type="module"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-white/90 backdrop-blur-sm dark:bg-black/90"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div ref={containerRef} className="flex items-center justify-center">
          {!scriptReady ? (
            <div
              className="animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800"
              style={{ width: LOTTIE_SIZE, height: LOTTIE_SIZE }}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}
