import type { User } from "@supabase/supabase-js";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export type AuthUserRow = {
  id: string;
  email: string;
  created_at: string;
};

export async function listAllAuthUsers(): Promise<AuthUserRow[]> {
  const supabase = createServiceRoleClient();
  if (!supabase) {
    throw new Error("Service role not configured");
  }

  const users: User[] = [];
  let page = 1;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 1000,
    });

    if (error) {
      throw new Error(error.message);
    }

    users.push(...data.users);

    if (data.users.length < 1000) {
      break;
    }

    page += 1;
  }

  return users
    .map((user) => ({
      id: user.id,
      email: user.email?.trim().toLowerCase() ?? "",
      created_at: user.created_at,
    }))
    .filter((user) => user.email.length > 0);
}
