import { NextResponse } from "next/server";
import { getStaffUser } from "@/lib/adminAuth";
import type { AnimeNewsStatus } from "@/lib/animeNews/types";
import { isAnimeNewsPublishReady } from "@/lib/animeNews/types";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type UpdateBody = {
  titleEn?: string;
  titleAr?: string;
  titleJa?: string;
  excerptEn?: string;
  excerptAr?: string;
  excerptJa?: string;
  topics?: string[];
  status?: AnimeNewsStatus;
};

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const supabase = await createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { user } = await getStaffUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  let body: UpdateBody;

  try {
    body = (await request.json()) as UpdateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { data: existing, error: loadError } = await supabase
    .from("anime_news_articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (loadError) {
    return NextResponse.json({ error: loadError.message }, { status: 500 });
  }

  if (!existing) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body.titleEn !== undefined) patch.title_en = body.titleEn.trim();
  if (body.titleAr !== undefined) patch.title_ar = body.titleAr.trim() || null;
  if (body.titleJa !== undefined) patch.title_ja = body.titleJa.trim() || null;
  if (body.excerptEn !== undefined) patch.excerpt_en = body.excerptEn.trim() || null;
  if (body.excerptAr !== undefined) patch.excerpt_ar = body.excerptAr.trim() || null;
  if (body.excerptJa !== undefined) patch.excerpt_ja = body.excerptJa.trim() || null;
  if (body.topics !== undefined) {
    patch.topics = body.topics
      .map((topic) => topic.trim().replace(/^#/, "").toLowerCase())
      .filter(Boolean);
  }
  if (body.status !== undefined) patch.status = body.status;

  const merged = { ...existing, ...patch };

  if (body.status === "published" && !isAnimeNewsPublishReady(merged as typeof existing)) {
    return NextResponse.json(
      { error: "Fill title and excerpt in EN, AR, and JA before publishing." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("anime_news_articles")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, article: data });
}
