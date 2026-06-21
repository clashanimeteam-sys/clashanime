import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function rpcExists(error: { message?: string; code?: string } | null) {
  if (!error) return false;
  return (
    error.message?.includes("not authenticated") ||
    error.message?.includes("unavailable") ||
    error.message?.includes("required") ||
    error.message?.includes("minimum wager") ||
    error.message?.includes("missing video ids") ||
    error.message?.includes("opponent not found") ||
    error.code === "P0001"
  );
}

export async function GET() {
  const supabase = await createServerClient();

  if (!supabase) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing Supabase configuration",
      },
      { status: 503 },
    );
  }

  const [{ error: videoDuelsError }, { error: pointsWagerError }] = await Promise.all([
    supabase.from("video_duels").select("id", { head: true, count: "exact" }),
    supabase.from("points_wager_duels").select("id", { head: true, count: "exact" }),
  ]);

  const videoDuelsTable = !videoDuelsError;
  const pointsWagerDuelsTable = !pointsWagerError;

  let createVideoDuelRpc = false;
  let createPointsWagerRpc = false;
  let profileSearchRpc = false;

  if (videoDuelsTable) {
    const { error } = await supabase.rpc("create_video_duel", {
      p_challenged_video_id: "00000000-0000-0000-0000-000000000000",
      p_challenger_video_id: "00000000-0000-0000-0000-000000000001",
    });
    createVideoDuelRpc = rpcExists(error);
  }

  if (pointsWagerDuelsTable) {
    const { error } = await supabase.rpc("create_points_wager_duel", {
      p_opponent_username: "__health_check__",
      p_creator_video_id: "00000000-0000-0000-0000-000000000000",
      p_wager_points: 10,
    });
    createPointsWagerRpc = rpcExists(error);
  }

  const { data: profileSearchData, error: profileSearchError } = await supabase.rpc(
    "search_profile_usernames",
    {
      p_query: "a",
      p_exclude_user_id: null,
      p_limit: 1,
    },
  );

  profileSearchRpc = !profileSearchError && Array.isArray(profileSearchData);

  return NextResponse.json({
    ok:
      videoDuelsTable &&
      createVideoDuelRpc &&
      pointsWagerDuelsTable &&
      createPointsWagerRpc &&
      profileSearchRpc,
    videoDuelsTable,
    createVideoDuelRpc,
    pointsWagerDuelsTable,
    createPointsWagerRpc,
    profileSearchRpc,
    profileSearchError: profileSearchError?.message ?? null,
    sqlScripts: [
      "supabase/scripts/production-daily-hall-duel.sql",
      "supabase/scripts/production-video-duels.sql",
      "supabase/scripts/production-points-wager-duels.sql",
      "supabase/scripts/production-profile-username-search.sql",
    ],
    combinedScript: "supabase/scripts/production-exclusives-full-deploy.sql",
    sqlEditor:
      "https://supabase.com/dashboard/project/doqiuduigbdoczdzsima/sql/new",
  });
}
