-- Allow optional custom cover image URL on community track submissions.

drop function if exists public.submit_anime_beats_track(text, text, text, text);

create or replace function public.submit_anime_beats_track(
  p_title text,
  p_artist text,
  p_youtube_input text,
  p_anime_title text default null,
  p_artwork_url text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_title text;
  normalized_artist text;
  normalized_artwork text;
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

  normalized_artwork := nullif(trim(coalesce(p_artwork_url, '')), '');

  if normalized_artwork is not null then
    if normalized_artwork !~* '^https?://' or char_length(normalized_artwork) > 2048 then
      raise exception 'invalid artwork url';
    end if;
  end if;

  video_id := public._normalize_youtube_video_id(p_youtube_input);

  insert into public.anime_beats_tracks (
    title,
    artist,
    anime_title,
    youtube_video_id,
    artwork_url,
    submitter_id,
    status
  )
  values (
    normalized_title,
    normalized_artist,
    nullif(trim(coalesce(p_anime_title, '')), ''),
    video_id,
    normalized_artwork,
    auth.uid(),
    'pending'
  )
  returning id into track_id;

  return track_id;
end;
$$;

grant execute on function public.submit_anime_beats_track(text, text, text, text, text) to authenticated;

notify pgrst, 'reload schema';
