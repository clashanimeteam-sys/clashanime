import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

const OWNER_USER_ID = "e0399a69-015b-4b18-bdc8-3e790fba2f04";
const OWNER_USERNAME = "clashanimeteam";

export async function POST(request: Request) {
  const setupToken = process.env.ADMIN_SETUP_TOKEN?.trim();
  const providedToken = request.headers.get("x-admin-setup-token")?.trim();

  if (!setupToken || providedToken !== setupToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceRoleClient();

  if (!supabase) {
    return NextResponse.json(
      {
        error: "Missing SUPABASE_SERVICE_ROLE_KEY or Supabase URL",
        hint: "Add SUPABASE_SERVICE_ROLE_KEY to Vercel, or run supabase/scripts/production-admin-setup.sql manually.",
      },
      { status: 500 },
    );
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ role: "admin" })
    .or(`username.eq.${OWNER_USERNAME},id.eq.${OWNER_USER_ID}`)
    .select("id, username, display_name, role")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
        hint: "Run supabase/scripts/production-admin-setup.sql in https://supabase.com/dashboard/project/doqiuduigbdoczdzsima/sql/new",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    profile: data,
  });
}
