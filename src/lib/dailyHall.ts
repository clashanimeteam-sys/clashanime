import { createServerClient } from "@/lib/supabase/server";

export type DailyHallLeader = {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  pointsToday: number;
  level: number;
};

export async function getDailyInteractionLeader(): Promise<DailyHallLeader | null> {
  const supabase = await createServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("get_daily_interaction_leader");

  if (error || !data?.length) {
    return null;
  }

  const row = data[0] as {
    user_id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    points_today: number;
    level: number;
  };

  return {
    userId: row.user_id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    pointsToday: Number(row.points_today),
    level: row.level ?? 1,
  };
}
