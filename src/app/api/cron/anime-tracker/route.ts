import { NextResponse } from "next/server";
import { fetchAniListAiringSchedule } from "@/lib/anilist";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorizeCron(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceRole = createServiceRoleClient();
  if (!serviceRole) {
    return NextResponse.json({ error: "Service role not configured" }, { status: 503 });
  }

  let synced = 0;
  let syncErrors = 0;

  try {
    const schedule = await fetchAniListAiringSchedule(14);
    for (const entry of schedule) {
      const { error } = await serviceRole.rpc("upsert_anime_release_from_sync", {
        p_anilist_id: entry.anilistId,
        p_title: entry.title,
        p_release_date: entry.releaseDate,
        p_episode_number: entry.episodeNumber,
        p_airs_at: entry.airsAt,
        p_poster_url: entry.posterUrl,
        p_title_ja: entry.titleJa,
        p_match_tags: entry.matchTags,
      });

      if (error) syncErrors += 1;
      else synced += 1;
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "AniList sync failed",
        synced,
        syncErrors,
      },
      { status: 500 },
    );
  }

  const { data: openedCount, error: processError } = await serviceRole.rpc(
    "process_due_anime_release_clashes",
  );

  if (processError) {
    return NextResponse.json(
      {
        error: processError.message,
        synced,
        syncErrors,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    synced,
    syncErrors,
    clashesOpened: openedCount ?? 0,
  });
}
