import { NextResponse } from "next/server";
import { getStaffUser } from "@/lib/adminAuth";
import {
  createWatchSourceForAdmin,
  deleteWatchSourceForAdmin,
  getWatchAutoProvidersEnabled,
  listWatchSourcesForAdmin,
  setWatchAutoProvidersEnabled,
} from "@/lib/watchAdmin";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { user } = await getStaffUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [sources, autoProvidersEnabled] = await Promise.all([
      listWatchSourcesForAdmin(),
      getWatchAutoProvidersEnabled(),
    ]);
    return NextResponse.json({ sources, autoProvidersEnabled });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load watch sources" },
      { status: 500 },
    );
  }
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

    if (typeof body.enabled === "boolean" && Object.keys(body).length === 1) {
      await setWatchAutoProvidersEnabled(body.enabled);
      return NextResponse.json({ autoProvidersEnabled: body.enabled });
    }

    const source = await createWatchSourceForAdmin({
      mal_id: Number(body.mal_id),
      content_type: body.content_type as "movie" | "episode",
      episode_number: body.content_type === "episode" ? Number(body.episode_number) : null,
      label: String(body.label ?? "سيرفر"),
      embed_url: String(body.embed_url),
      stream_type: (body.stream_type as "embed" | "hls" | "mp4" | undefined) ?? "embed",
      subtitle_url: body.subtitle_url ? String(body.subtitle_url) : null,
      qualities: Array.isArray(body.qualities) ? (body.qualities as Array<{ label: string; url: string }>) : null,
      referer: body.referer ? String(body.referer) : null,
      language: body.language ? String(body.language) : "ar",
    });

    return NextResponse.json({ source });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save watch source" },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  const supabase = await createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { user } = await getStaffUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    await deleteWatchSourceForAdmin(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete" },
      { status: 400 },
    );
  }
}
