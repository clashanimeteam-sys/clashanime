import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { watchSiteUrl } from "@/lib/watchSiteLinks";

/** Public product surfaces removed for copyright-safe content-only mode. Admin/login stay reachable by direct URL. */
const BLOCKED_PREFIXES = [
  "/earn",
  "/videos",
  "/community",
  "/exclusives",
  "/upload",
  "/video",
  "/duel",
  "/channel",
  "/profile",
  "/settings",
  "/tracker/clash",
] as const;

/** Old clashanime watch surfaces → Watch Clash Anime. */
const WATCH_REDIRECT_PREFIXES = ["/watch", "/blog/anime-news/watch-now"] as const;

function isBlockedPath(pathname: string): boolean {
  return BLOCKED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function watchRedirectUrl(pathname: string): string | null {
  const base = watchSiteUrl();
  for (const prefix of WATCH_REDIRECT_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      const malMatch = pathname.match(/\/watch-now\/mal\/(\d+)/);
      if (malMatch) return `${base}/anime/${malMatch[1]}`;
      const watchMal = pathname.match(/^\/watch\/(\d+)(?:\/(\d+))?/);
      if (watchMal) {
        const ep = watchMal[2] || "1";
        return `${base}/watch/${watchMal[1]}/${ep}`;
      }
      return `${base}/`;
    }
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const watchTarget = watchRedirectUrl(pathname);
  if (watchTarget) {
    return NextResponse.redirect(watchTarget, 307);
  }

  if (isBlockedPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url.replace(/\/rest\/v1\/?$/i, "").replace(/\/$/, ""), anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|ads/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|js)$).*)",
  ],
};
