import { createClient } from "@supabase/supabase-js";

export type WatchSourceRow = {
  id: string;
  mal_id: number;
  content_type: "movie" | "episode";
  episode_number: number | null;
  label: string;
  embed_url: string;
  stream_type: "embed" | "hls" | "mp4";
  subtitle_url: string | null;
  qualities: Array<{ label: string; url: string }> | null;
  referer: string | null;
  headers: Record<string, string> | null;
  language: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export function createWatchAdminClient() {
  const url = process.env.WATCH_SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_WATCH_SUPABASE_URL?.trim();
  const key = process.env.WATCH_SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !key) {
    throw new Error("Watch Supabase credentials are missing");
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function listWatchSourcesForAdmin(limit = 100) {
  const supabase = createWatchAdminClient();
  const { data, error } = await supabase
    .from("watch_sources")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as WatchSourceRow[];
}

export async function getWatchAutoProvidersEnabled() {
  const supabase = createWatchAdminClient();
  const { data } = await supabase
    .from("watch_provider_settings")
    .select("value")
    .eq("key", "auto_providers")
    .maybeSingle();

  return Boolean((data?.value as { enabled?: boolean } | null)?.enabled ?? true);
}

export async function setWatchAutoProvidersEnabled(enabled: boolean) {
  const supabase = createWatchAdminClient();
  const { error } = await supabase.from("watch_provider_settings").upsert({
    key: "auto_providers",
    value: { enabled, providers: ["vidlink", "vidsrcicu", "twoembed"] },
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
}

export async function createWatchSourceForAdmin(input: {
  mal_id: number;
  content_type: "movie" | "episode";
  episode_number?: number | null;
  label: string;
  embed_url: string;
  stream_type?: "embed" | "hls" | "mp4";
  subtitle_url?: string | null;
  qualities?: Array<{ label: string; url: string }> | null;
  referer?: string | null;
  language?: string;
}) {
  const supabase = createWatchAdminClient();
  const { data, error } = await supabase
    .from("watch_sources")
    .insert({
      mal_id: input.mal_id,
      content_type: input.content_type,
      episode_number: input.content_type === "movie" ? null : input.episode_number ?? null,
      label: input.label,
      embed_url: input.embed_url,
      stream_type: input.stream_type ?? "embed",
      subtitle_url: input.subtitle_url ?? null,
      qualities: input.qualities ?? null,
      referer: input.referer ?? null,
      language: input.language ?? "ar",
      sort_order: 0,
      is_active: true,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as WatchSourceRow;
}

export async function deleteWatchSourceForAdmin(id: string) {
  const supabase = createWatchAdminClient();
  const { error } = await supabase.from("watch_sources").delete().eq("id", id);
  if (error) throw error;
}
