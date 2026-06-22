import { createServerClient } from "@/lib/supabase/server";
import type { BeatsTrack } from "@/lib/animeBeatsLounge";

export async function getAnimeBeatsPlaylist(): Promise<BeatsTrack[]> {
  const supabase = await createServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase.rpc("get_anime_beats_playlist");
  if (error || !data?.length) return [];

  return (data as Array<{
    id: string;
    title: string;
    artist: string;
    anime_title: string | null;
    youtube_video_id: string;
    artwork_url: string | null;
    vote_count: number;
    sort_order: number;
    user_has_voted: boolean;
  }>).map((row) => ({
    id: row.id,
    title: row.title,
    artist: row.artist,
    animeTitle: row.anime_title,
    youtubeVideoId: row.youtube_video_id,
    artworkUrl: row.artwork_url,
    voteCount: Number(row.vote_count),
    sortOrder: Number(row.sort_order),
    userHasVoted: Boolean(row.user_has_voted),
  }));
}
