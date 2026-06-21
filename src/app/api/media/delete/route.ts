import { NextResponse } from "next/server";
import { deleteR2Objects } from "@/lib/r2/client";
import { isR2Configured, isUserOwnedObjectKey } from "@/lib/r2/config";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabase = await createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isR2Configured()) {
    return NextResponse.json({ error: "R2 not configured" }, { status: 503 });
  }

  let body: { keys?: unknown };
  try {
    body = (await request.json()) as { keys?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!Array.isArray(body.keys) || body.keys.length === 0) {
    return NextResponse.json({ error: "keys required" }, { status: 400 });
  }

  const keys = body.keys.filter((key): key is string => typeof key === "string");
  if (keys.length !== body.keys.length) {
    return NextResponse.json({ error: "invalid keys" }, { status: 400 });
  }

  if (keys.some((key) => !isUserOwnedObjectKey(key, user.id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await deleteR2Objects(keys);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "delete failed" },
      { status: 500 },
    );
  }
}
