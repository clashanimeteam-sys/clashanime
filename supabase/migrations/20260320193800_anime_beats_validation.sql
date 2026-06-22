-- Relax beats lounge text validation for Arabic/single-character names.

create or replace function public.submit_anime_beats_track(
  p_title text,
  p_artist text,
  p_youtube_input text,
  p_anime_title text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_title text;
  normalized_artist text;
  video_id text;
  track_id uuid;
begin
  if auth.uid() is null then
    raise exception 'login required';
  end if;

  normalized_title := trim(coalesce(p_title, ''));
  normalized_artist := trim(coalesce(p_artist, ''));

  if normalized_title = '' then
    raise exception 'valid title required';
  end if;

  if normalized_artist = '' then
    raise exception 'valid artist required';
  end if;

  video_id := public._normalize_youtube_video_id(p_youtube_input);

  insert into public.anime_beats_tracks (
    title,
    artist,
    anime_title,
    youtube_video_id,
    submitter_id,
    status
  )
  values (
    normalized_title,
    normalized_artist,
    nullif(trim(coalesce(p_anime_title, '')), ''),
    video_id,
    auth.uid(),
    'pending'
  )
  returning id into track_id;

  return track_id;
end;
$$;

notify pgrst, 'reload schema';
