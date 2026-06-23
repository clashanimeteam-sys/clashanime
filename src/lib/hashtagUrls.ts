export function normalizeHashtagSlug(raw: string) {
  return raw.trim().replace(/^#+/, "").toLowerCase();
}

export function buildHashtagPath(raw: string) {
  const slug = normalizeHashtagSlug(raw);
  return slug ? `/hashtag/${encodeURIComponent(slug)}` : "/videos";
}
