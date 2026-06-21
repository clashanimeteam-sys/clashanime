import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createServerClient();

  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { points?: number };
  try {
    body = (await request.json()) as { points?: number };
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const points = body.points;
  if (typeof points !== "number" || !Number.isInteger(points) || points <= 0) {
    return NextResponse.json({ error: "Invalid points amount" }, { status: 400 });
  }

  const { data, error } = await supabase.rpc("convert_points_to_clash_coins", {
    point_amount: points,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, result: data });
}
