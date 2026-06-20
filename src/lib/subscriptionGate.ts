export function getSignupUrl(nextPath?: string | null): string {
  if (!nextPath) return "/signup";
  if (!nextPath.startsWith("/") || nextPath.startsWith("//")) return "/signup";
  return `/signup?next=${encodeURIComponent(nextPath)}`;
}

export function getCurrentPath(): string {
  if (typeof window === "undefined") return "/";
  return `${window.location.pathname}${window.location.search}`;
}
