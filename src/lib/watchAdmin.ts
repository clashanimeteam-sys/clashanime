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

  return Boolean((data?.value as { enabled?: boolean; embedAdsEnabled?: boolean } | null)?.enabled ?? false);
}

export async function getWatchEmbedAdsEnabled() {
  const supabase = createWatchAdminClient();
  const { data } = await supabase
    .from("watch_provider_settings")
    .select("value")
    .eq("key", "auto_providers")
    .maybeSingle();

  const value = data?.value as { embedAdsEnabled?: boolean; enabled?: boolean } | null;
  return Boolean(value?.embedAdsEnabled ?? value?.enabled ?? false);
}

export async function setWatchAutoProvidersEnabled(enabled: boolean) {
  const supabase = createWatchAdminClient();
  const { data } = await supabase
    .from("watch_provider_settings")
    .select("value")
    .eq("key", "auto_providers")
    .maybeSingle();
  const current = (data?.value as { providers?: string[] } | null) ?? {};

  const { error } = await supabase.from("watch_provider_settings").upsert({
    key: "auto_providers",
    value: {
      enabled,
      embedAdsEnabled: enabled,
      providers: current.providers ?? ["vidlink", "vidsrcicu", "twoembed"],
    },
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

export type BulkEpisodeInput = {
  episode: number;
  video_url?: string;
  embed_url?: string;
  subtitle_url?: string | null;
  stream_type?: "embed" | "hls" | "mp4";
  label?: string;
  referer?: string | null;
};

function inferStreamType(url: string): "embed" | "hls" | "mp4" {
  const lower = url.toLowerCase();
  if (lower.includes(".m3u8") || lower.includes("/hls")) return "hls";
  if (lower.includes(".mp4")) return "mp4";
  return "embed";
}

function sourceKey(episodeNumber: number, label: string) {
  return `${episodeNumber}:${label}`;
}

/** Upsert many episode rows for one MAL title into Watch Supabase `watch_sources`. */
export async function bulkUpsertWatchEpisodesForAdmin(input: {
  mal_id: number;
  episodes: BulkEpisodeInput[];
  default_label?: string;
  default_stream_type?: "embed" | "hls" | "mp4";
  default_referer?: string | null;
  language?: string;
}) {
  if (!Number.isFinite(input.mal_id) || input.mal_id <= 0) {
    throw new Error("Invalid mal_id");
  }
  if (!Array.isArray(input.episodes) || input.episodes.length === 0) {
    throw new Error("episodes must be a non-empty array");
  }

  const supabase = createWatchAdminClient();
  const defaultLabel = (input.default_label ?? "ClashAnime").trim() || "ClashAnime";
  const language = input.language ?? "ar";

  const { data: existing, error: listError } = await supabase
    .from("watch_sources")
    .select("*")
    .eq("mal_id", input.mal_id)
    .eq("content_type", "episode");

  if (listError) throw listError;

  const byKey = new Map<string, WatchSourceRow>();
  for (const row of (existing ?? []) as WatchSourceRow[]) {
    if (row.episode_number == null) continue;
    byKey.set(sourceKey(row.episode_number, row.label), row);
  }

  const inserted: WatchSourceRow[] = [];
  const updated: WatchSourceRow[] = [];

  for (const raw of input.episodes) {
    const episodeNumber = Number(raw.episode);
    if (!Number.isFinite(episodeNumber) || episodeNumber < 1) {
      throw new Error(`Invalid episode number: ${String(raw.episode)}`);
    }

    const embedUrl = String(raw.embed_url ?? raw.video_url ?? "").trim();
    if (!embedUrl) {
      throw new Error(`Episode ${episodeNumber}: missing video_url / embed_url`);
    }

    const label = (raw.label ?? defaultLabel).trim() || defaultLabel;
    const streamType =
      raw.stream_type ?? input.default_stream_type ?? inferStreamType(embedUrl);
    const subtitleUrl = raw.subtitle_url?.trim() ? raw.subtitle_url.trim() : null;
    const referer =
      raw.referer?.trim() || input.default_referer?.trim() || null;
    const key = sourceKey(episodeNumber, label);
    const existingRow = byKey.get(key);

    if (existingRow) {
      const { data, error } = await supabase
        .from("watch_sources")
        .update({
          embed_url: embedUrl,
          stream_type: streamType,
          subtitle_url: subtitleUrl,
          referer,
          language,
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingRow.id)
        .select("*")
        .single();

      if (error) throw error;
      const row = data as WatchSourceRow;
      updated.push(row);
      byKey.set(key, row);
    } else {
      const { data, error } = await supabase
        .from("watch_sources")
        .insert({
          mal_id: input.mal_id,
          content_type: "episode",
          episode_number: episodeNumber,
          label,
          embed_url: embedUrl,
          stream_type: streamType,
          subtitle_url: subtitleUrl,
          qualities: null,
          referer,
          language,
          sort_order: episodeNumber,
          is_active: true,
        })
        .select("*")
        .single();

      if (error) throw error;
      const row = data as WatchSourceRow;
      inserted.push(row);
      byKey.set(key, row);
    }
  }

  return {
    inserted,
    updated,
    count: inserted.length + updated.length,
  };
}
