import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createServiceRoleClient();

  if (!supabase) {
    return NextResponse.json(
      {
        ok: false,
        videoDuelsTable: false,
        createVideoDuelRpc: false,
        error: "Missing Supabase service role configuration",
      },
      { status: 503 },
    );
  }

  const [{ error: tableError }, { error: rpcError }] = await Promise.all([
    supabase.from("video_duels").select("id", { head: true, count: "exact" }),
    supabase.rpc("create_video_duel", {
      p_challenged_video_id: "00000000-0000-0000-0000-000000000000",
      p_challenger_video_id: "00000000-0000-0000-0000-000000000001",
    }),
  ]);

  const videoDuelsTable = !tableError;
  const createVideoDuelRpc =
    rpcError?.message.includes("not authenticated") ||
    rpcError?.message.includes("challenged video unavailable") ||
    rpcError?.message.includes("missing video ids") ||
    rpcError?.code === "P0001";

  return NextResponse.json({
    ok: videoDuelsTable && createVideoDuelRpc,
    videoDuelsTable,
    createVideoDuelRpc,
    tableError: tableError?.message ?? null,
    rpcError: rpcError?.message ?? null,
    sqlScript: "supabase/scripts/production-video-duels.sql",
    sqlEditor:
      "https://supabase.com/dashboard/project/doqiuduigbdoczdzsima/sql/new",
  });
}
