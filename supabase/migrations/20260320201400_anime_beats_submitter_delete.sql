-- Let users list and delete their own anime beats lounge submissions

create or replace function public.list_my_anime_beats_tracks()
returns table (
  id uuid,
  title text,
  artist text,
  anime_title text,
  youtube_video_id text,
  artwork_url text,
  status text,
  vote_count integer,
  created_at timestamptz,
  review_note text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    t.id,
    t.title,
    t.artist,
    t.anime_title,
    t.youtube_video_id,
    t.artwork_url,
    t.status,
    t.vote_count,
    t.created_at,
    t.review_note
  from public.anime_beats_tracks t
  where t.submitter_id = auth.uid()
  order by t.created_at desc;
$$;

create or replace function public.delete_my_anime_beats_track(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'login required';
  end if;

  delete from public.anime_beats_tracks
  where id = p_id
    and submitter_id = auth.uid();

  if not found then
    raise exception 'track not found';
  end if;
end;
$$;

grant execute on function public.list_my_anime_beats_tracks() to authenticated;
grant execute on function public.delete_my_anime_beats_track(uuid) to authenticated;

notify pgrst, 'reload schema';
