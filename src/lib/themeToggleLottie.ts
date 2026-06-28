export const THEME_TOGGLE_LOTTIE_SRC =
  "https://lottie.host/d2838ef9-af78-4540-b9f7-8783e07fab05/dW8z2iEssK.lottie";

export const DOTLOTTIE_WC_SCRIPT_SRC =
  "https://unpkg.com/@lottiefiles/dotlottie-wc@0.9.14/dist/dotlottie-wc.js";

/** Display size in the sidebar / header (source animation is larger). */
export const THEME_TOGGLE_LOTTIE_SIZE_PX = 48;

/**
 * Frame map from the Lottie timeline (481 frames @ 60fps):
 * - 115–300: moon / night (knob left)
 * - 385–480: sun / day (knob right)
 */
export const THEME_TOGGLE_LIGHT_FRAME = 385;
export const THEME_TOGGLE_DARK_FRAME = 300;
export const THEME_TOGGLE_TRANSITION_START = 115;
export const THEME_TOGGLE_TRANSITION_END = 385;

export function getThemeToggleFrame(isDark: boolean) {
  return isDark ? THEME_TOGGLE_DARK_FRAME : THEME_TOGGLE_LIGHT_FRAME;
}
