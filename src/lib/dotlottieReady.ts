let dotlottieScriptReady = typeof window !== "undefined" && Boolean(customElements.get("dotlottie-wc"));

const dotlottieListeners = new Set<() => void>();

export function subscribeDotlottie(onStoreChange: () => void) {
  dotlottieListeners.add(onStoreChange);
  return () => {
    dotlottieListeners.delete(onStoreChange);
  };
}

export function getDotlottieSnapshot() {
  return dotlottieScriptReady || Boolean(typeof window !== "undefined" && customElements.get("dotlottie-wc"));
}

export function getDotlottieServerSnapshot() {
  return false;
}

export function markDotlottieReady() {
  if (dotlottieScriptReady) return;
  dotlottieScriptReady = true;
  dotlottieListeners.forEach((listener) => listener());
}
