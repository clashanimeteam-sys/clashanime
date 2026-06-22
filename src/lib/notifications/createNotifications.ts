import type { SupabaseClient } from "@supabase/supabase-js";

type NotificationInsert = {
  user_id: string;
  type: string;
  title: string;
  body: string;
  link?: string | null;
};

export async function insertUserNotifications(
  supabase: SupabaseClient,
  rows: NotificationInsert[],
) {
  if (rows.length === 0) return { ok: true as const, count: 0 };

  const { error } = await supabase.from("user_notifications").insert(rows);

  if (error) {
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const, count: rows.length };
}

export async function notifyMentionedUsers(options: {
  supabase: SupabaseClient;
  body: string;
  actorUserId: string;
  actorName: string;
  link: string;
  title: string;
  preview: string;
}) {
  const { supabase, body, actorUserId, actorName, link, title, preview } = options;

  const mentionMatches = body.matchAll(/(?:^|\s)@([a-z0-9_]{3,30})/gi);
  const usernames = new Set<string>();

  for (const match of mentionMatches) {
    const username = match[1]?.toLowerCase();
    if (username) {
      usernames.add(username);
    }
  }

  if (usernames.size === 0) {
    return { ok: true as const, count: 0 };
  }

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, username")
    .in("username", [...usernames]);

  if (profilesError) {
    return { ok: false as const, error: profilesError.message };
  }

  const rows = (profiles ?? [])
    .filter((profile) => profile.id !== actorUserId)
    .map((profile) => ({
      user_id: profile.id,
      type: "mention",
      title,
      body: `${actorName} ${preview}`,
      link,
    }));

  return insertUserNotifications(supabase, rows);
}
