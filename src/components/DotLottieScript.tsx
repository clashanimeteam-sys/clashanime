"use client";

import Script from "next/script";
import { DOTLOTTIE_SCRIPT } from "@/lib/dotlottie";
import { markDotlottieReady } from "@/lib/dotlottieReady";

export function DotLottieScript() {
  return (
    <Script
      id="clashanime-dotlottie-wc"
      src={DOTLOTTIE_SCRIPT}
      type="module"
      strategy="afterInteractive"
      onReady={markDotlottieReady}
      onLoad={markDotlottieReady}
    />
  );
}
