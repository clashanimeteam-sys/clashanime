import { createServerClient } from "@/lib/supabase/server";
import { mapBeatsPlaylistRow, type BeatsTrack } from "@/lib/animeBeatsLounge";

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
  }>).map((row) => mapBeatsPlaylistRow(row));
}
