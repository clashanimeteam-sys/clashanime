import { NextResponse } from "next/server";
import { getStaffUser } from "@/lib/adminAuth";
import {
  bulkUpsertWatchEpisodesForAdmin,
  type BulkEpisodeInput,
} from "@/lib/watchAdmin";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function parseEpisodes(raw: unknown): BulkEpisodeInput[] {
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) throw new Error("episodes JSON is empty");
    raw = JSON.parse(trimmed) as unknown;
  }

  if (!Array.isArray(raw)) {
    throw new Error("episodes must be a JSON array");
  }

  return raw.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`episodes[${index}] must be an object`);
    }
    const row = item as Record<string, unknown>;
    const episode = Number(row.episode ?? row.episode_number);
    if (!Number.isFinite(episode)) {
      throw new Error(`episodes[${index}]: missing episode / episode_number`);
    }

    return {
      episode,
      video_url: row.video_url != null ? String(row.video_url) : undefined,
      embed_url: row.embed_url != null ? String(row.embed_url) : undefined,
      subtitle_url:
        row.subtitle_url != null && String(row.subtitle_url).trim()
          ? String(row.subtitle_url)
          : null,
      stream_type:
        row.stream_type === "embed" || row.stream_type === "hls" || row.stream_type === "mp4"
          ? row.stream_type
          : undefined,
      label: row.label != null ? String(row.label) : undefined,
      referer: row.referer != null ? String(row.referer) : null,
    } satisfies BulkEpisodeInput;
  });
}

export async function POST(request: Request) {
  const supabase = await createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { user } = await getStaffUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const malId = Number(body.mal_id ?? body.anime_id);
    if (!Number.isFinite(malId) || malId <= 0) {
      return NextResponse.json(
        { error: "mal_id is required (MAL ID used by watch sources)" },
        { status: 400 },
      );
    }

    const episodes = parseEpisodes(body.episodes);
    const result = await bulkUpsertWatchEpisodesForAdmin({
      mal_id: malId,
      episodes,
      default_label: body.label ? String(body.label) : "ClashAnime",
      default_stream_type:
        body.stream_type === "embed" || body.stream_type === "hls" || body.stream_type === "mp4"
          ? body.stream_type
          : undefined,
      default_referer: body.referer ? String(body.referer) : null,
      language: body.language ? String(body.language) : "ar",
    });

    return NextResponse.json({
      ok: true,
      mal_id: malId,
      count: result.count,
      inserted: result.inserted.length,
      updated: result.updated.length,
      sources: [...result.inserted, ...result.updated],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Bulk import failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
