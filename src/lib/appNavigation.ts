import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/** Client-side navigation that updates profile hash sections without a full route change. */
export function navigateAppHref(
  router: AppRouterInstance,
  currentPathname: string,
  href: string,
) {
  const [path, hash = ""] = href.split("#");
  const targetPath = path || currentPathname;

  if (targetPath === currentPathname && hash) {
    window.history.pushState(null, "", `${targetPath}#${hash}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    return;
  }

  router.push(href);
}
