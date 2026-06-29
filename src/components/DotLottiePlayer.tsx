"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { DOTLOTTIE_SIZE } from "@/lib/dotlottie";
import {
  getDotlottieServerSnapshot,
  getDotlottieSnapshot,
  subscribeDotlottie,
} from "@/lib/dotlottieReady";

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
  const scriptReady = useSyncExternalStore(
    subscribeDotlottie,
    getDotlottieSnapshot,
    getDotlottieServerSnapshot,
  );

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
    <div ref={containerRef} className={className}>
      {!scriptReady ? (
        <div
          className="animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800"
          style={{ width: size, height: size }}
        />
      ) : null}
    </div>
  );
}
