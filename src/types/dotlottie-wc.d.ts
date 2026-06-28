import type { DetailedHTMLProps, HTMLAttributes } from "react";

type DotLottieWcProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement> & {
    src?: string;
    autoplay?: boolean;
    loop?: boolean;
  },
  HTMLElement
>;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "dotlottie-wc": DotLottieWcProps;
    }
  }
}

export {};
