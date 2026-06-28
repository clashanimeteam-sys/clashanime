import { NextResponse } from "next/server";
import { LATEST_MIGRATION_CHECKS, type SchemaCheckResult } from "@/lib/schemaHealth";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function isMissingColumn(error: { message?: string; code?: string } | null) {
  if (!error) return false;
  return (
    error.code === "42703" ||
    error.message?.includes("column") ||
    error.message?.includes("Could not find")
  );
}

function isMissingTable(error: { message?: string; code?: string } | null) {
  if (!error) return false;
  return error.code === "42P01" || error.message?.includes("does not exist");
}

export async function GET() {
  const supabase = await createServerClient();

  if (!supabase) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing Supabase configuration",
        checks: [],
      },
      { status: 503 },
    );
  }

  const checks: SchemaCheckResult[] = [];

  const profileSocial = await supabase
    .from("profiles")
    .select("instagram_url, tiktok_url, twitter_url, website_url")
    .limit(1);
  checks.push({
    ...LATEST_MIGRATION_CHECKS[0],
    ok: !profileSocial.error,
    error: profileSocial.error?.message ?? null,
  });

  const spotlight = await supabase.from("anime_spotlight_catalog").select("id").limit(1);
  checks.push({
    ...LATEST_MIGRATION_CHECKS[1],
    ok: !isMissingTable(spotlight.error),
    error: spotlight.error?.message ?? null,
  });

  const seasonal = await supabase.from("anime_news_articles").select("seasonal_lineup").limit(1);
  checks.push({
    ...LATEST_MIGRATION_CHECKS[2],
    ok: !isMissingColumn(seasonal.error) && !isMissingTable(seasonal.error),
    error: seasonal.error?.message ?? null,
  });

  const featured = await supabase
    .from("anime_news_articles")
    .select("featured_anime_key, featured_youtube_id")
    .limit(1);
  checks.push({
    ...LATEST_MIGRATION_CHECKS[3],
    ok: !isMissingColumn(featured.error) && !isMissingTable(featured.error),
    error: featured.error?.message ?? null,
  });

  const newsCore = await supabase.from("anime_news_articles").select("id, slug").limit(1);
  checks.push({
    ...LATEST_MIGRATION_CHECKS[4],
    ok: !isMissingTable(newsCore.error),
    error: newsCore.error?.message ?? null,
  });

  const rpc = await supabase.rpc("update_own_profile_settings", {
    p_bio: "",
    p_display_name: "schema-health-check",
    p_instagram_url: "",
    p_tiktok_url: "",
    p_twitter_url: "",
    p_website_url: "",
  });
  const rpcOk =
    rpc.error?.message?.includes("not authenticated") ||
    rpc.error?.message?.includes("Profile not found") ||
    rpc.error?.code === "P0001" ||
    !rpc.error;

  checks.push({
    id: "update_own_profile_settings_social",
    ok: rpcOk,
    error: rpc.error?.message ?? null,
    migration: "20260320201300_profile_social_links.sql",
    script: "supabase/scripts/production-profile-social-links.sql",
    description: "update_own_profile_settings accepts social URL params",
  });

  const ok = checks.every((check) => check.ok);

  return NextResponse.json({
    ok,
    checks,
    pendingScripts: checks.filter((check) => !check.ok).map((check) => check.script),
    sqlEditor: "https://supabase.com/dashboard/project/doqiuduigbdoczdzsima/sql/new",
    relatedHealth: ["/api/health/clash-coins", "/api/health/media", "/api/health/video-duels"],
  });
}
