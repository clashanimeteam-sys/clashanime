import { NextResponse } from "next/server";
import { getClashArenaStats } from "@/lib/videos";

export const dynamic = "force-dynamic";

export async function GET() {
  const stats = await getClashArenaStats();
  return NextResponse.json(stats);
}
