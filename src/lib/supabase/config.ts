export function normalizeSupabaseUrl(url: string): string {
  return url
    .trim()
    .replace(/\/rest\/v1\/?$/i, "")
    .replace(/\/$/, "");
}

export function getSupabaseConfig():
  | { url: string; anonKey: string }
  | null {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!rawUrl || !anonKey) {
    return null;
  }

  return {
    url: normalizeSupabaseUrl(rawUrl),
    anonKey,
  };
}
