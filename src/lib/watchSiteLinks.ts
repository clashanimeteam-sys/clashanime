/** Links from clashanime.com → watchclashanime.com */

export function watchSiteUrl() {
  return process.env.NEXT_PUBLIC_WATCH_SITE_URL?.replace(/\/$/, "")
    || process.env.WATCH_SITE_URL?.replace(/\/$/, "")
    || "https://watchclashanime.com";
}

/** Open anime detail/watch on Watch Clash Anime (AniList or MAL id). */
export function publicWatchAnimeUrl(mediaId: number) {
  return `${watchSiteUrl()}/anime/${mediaId}`;
}

/** Open Watch Clash Anime home. */
export function publicWatchHomeUrl() {
  return `${watchSiteUrl()}/`;
}

/**
 * Member gate through clashanime → watchclashanime with JWT.
 * Guests are sent to login first.
 */
export function gatedWatchPath(nextPath = "/") {
  const safe = nextPath.startsWith("/") ? nextPath : "/";
  return `/api/watch/redirect?next=${encodeURIComponent(safe)}`;
}

export function gatedWatchAnimePath(mediaId: number) {
  return gatedWatchPath(`/anime/${mediaId}`);
}
