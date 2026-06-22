import { NextResponse } from "next/server";
import { listAllAuthUsers } from "@/lib/admin/listAuthUsers";
import { getAdminUser } from "@/lib/adminAuth";
import { createServerClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { user } = await getAdminUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const authUsers = await listAllAuthUsers();
    const serviceRole = createServiceRoleClient();

    const profilesById = new Map<string, { username: string; display_name: string | null }>();

    if (serviceRole && authUsers.length > 0) {
      const { data: profiles } = await serviceRole
        .from("profiles")
        .select("id, username, display_name")
        .in(
          "id",
          authUsers.map((row) => row.id),
        );

      for (const profile of profiles ?? []) {
        profilesById.set(profile.id, {
          username: profile.username,
          display_name: profile.display_name,
        });
      }
    }

    const users = authUsers.map((authUser) => {
      const profile = profilesById.get(authUser.id);
      return {
        id: authUser.id,
        email: authUser.email,
        username: profile?.username ?? null,
        display_name: profile?.display_name ?? null,
        created_at: authUser.created_at,
      };
    });

    return NextResponse.json({ users, total: users.length });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load users" },
      { status: 500 },
    );
  }
}
