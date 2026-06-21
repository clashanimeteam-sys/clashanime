import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createServerClient();

  if (!supabase) {
    return NextResponse.json(
      {
        ok: false,
        videoDuelsTable: false,
        createVideoDuelRpc: false,
        error: "Missing Supabase configuration",
      },
      { status: 503 },
    );
  }

  const { error: tableError } = await supabase
    .from("video_duels")
    .select("id", { head: true, count: "exact" });

  const videoDuelsTable = !tableError;

  let createVideoDuelRpc = false;
  let rpcErrorMessage: string | null = null;

  if (videoDuelsTable) {
    const { error: rpcError } = await supabase.rpc("create_video_duel", {
      p_challenged_video_id: "00000000-0000-0000-0000-000000000000",
      p_challenger_video_id: "00000000-0000-0000-0000-000000000001",
    });

    rpcErrorMessage = rpcError?.message ?? null;
    createVideoDuelRpc =
      rpcError?.message.includes("not authenticated") ||
      rpcError?.message.includes("challenged video unavailable") ||
      rpcError?.message.includes("missing video ids") ||
      rpcError?.code === "P0001";
  }

  return NextResponse.json({
    ok: videoDuelsTable && createVideoDuelRpc,
    videoDuelsTable,
    createVideoDuelRpc,
    tableError: tableError?.message ?? null,
    rpcError: rpcErrorMessage,
    sqlScript: "supabase/scripts/production-video-duels.sql",
    sqlEditor:
      "https://supabase.com/dashboard/project/doqiuduigbdoczdzsima/sql/new",
  });
}
