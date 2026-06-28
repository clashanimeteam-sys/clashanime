export const THEME_TOGGLE_LOTTIE_SRC =
  "https://lottie.host/d2838ef9-af78-4540-b9f7-8783e07fab05/dW8z2iEssK.lottie";

export const DOTLOTTIE_WC_SCRIPT_SRC =
  "https://unpkg.com/@lottiefiles/dotlottie-wc@0.9.14/dist/dotlottie-wc.js";

/** Display size in the sidebar / header (source animation is larger). */
export const THEME_TOGGLE_LOTTIE_SIZE_PX = 48;

/** Frame 0 = day / light, last frame = night / dark. */
export const THEME_TOGGLE_LIGHT_FRAME = 0;

export function getThemeToggleDarkFrame(totalFrames: number) {
  return Math.max(THEME_TOGGLE_LIGHT_FRAME, totalFrames - 1);
}

export function getThemeToggleFrame(totalFrames: number, isDark: boolean) {
  return isDark ? getThemeToggleDarkFrame(totalFrames) : THEME_TOGGLE_LIGHT_FRAME;
}
