-- Anime Beats Lounge: community-curated playlist for /music

create table if not exists public.anime_beats_tracks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text not null,
  anime_title text,
  youtube_video_id text not null,
  artwork_url text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  sort_order integer not null default 0,
  vote_count integer not null default 0,
  submitter_id uuid references public.profiles (id) on delete set null,
  review_note text,
  reviewed_by uuid references auth.users (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint anime_beats_tracks_youtube_id_check check (char_length(youtube_video_id) between 6 and 20)
);

create index if not exists anime_beats_tracks_status_idx on public.anime_beats_tracks (status);
create index if not exists anime_beats_tracks_playlist_idx
  on public.anime_beats_tracks (status, sort_order desc, vote_count desc, created_at asc);

create table if not exists public.anime_beats_votes (
  track_id uuid not null references public.anime_beats_tracks (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (track_id, user_id)
);

alter table public.anime_beats_tracks enable row level security;
alter table public.anime_beats_votes enable row level security;

drop policy if exists anime_beats_tracks_public_select on public.anime_beats_tracks;
create policy anime_beats_tracks_public_select
  on public.anime_beats_tracks
  for select
  using (status = 'approved' or public.is_staff());

drop policy if exists anime_beats_votes_public_select on public.anime_beats_votes;
create policy anime_beats_votes_public_select
  on public.anime_beats_votes
  for select
  using (true);

drop policy if exists anime_beats_votes_own_insert on public.anime_beats_votes;
create policy anime_beats_votes_own_insert
  on public.anime_beats_votes
  for insert
  with check (auth.uid() = user_id);

drop policy if exists anime_beats_votes_own_delete on public.anime_beats_votes;
create policy anime_beats_votes_own_delete
  on public.anime_beats_votes
  for delete
  using (auth.uid() = user_id);

create or replace function public._normalize_youtube_video_id(p_input text)
returns text
language plpgsql
immutable
as $$
declare
  raw text := trim(coalesce(p_input, ''));
  match text[];
begin
  if raw = '' then
    raise exception 'youtube url or video id required';
  end if;

  if raw ~ '^[a-zA-Z0-9_-]{11}$' then
    return raw;
  end if;

  match := regexp_match(raw, '(?:youtu\.be/|youtube\.com/(?:watch\?v=|embed/|shorts/))([a-zA-Z0-9_-]{11})');
  if match is not null then
    return match[1];
  end if;

  raise exception 'invalid youtube url or video id';
end;
$$;

create or replace function public.get_anime_beats_playlist()
returns table (
  id uuid,
  title text,
  artist text,
  anime_title text,
  youtube_video_id text,
  artwork_url text,
  vote_count integer,
  sort_order integer,
  user_has_voted boolean
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
    t.vote_count,
    t.sort_order,
    exists (
      select 1
      from public.anime_beats_votes v
      where v.track_id = t.id
        and v.user_id = auth.uid()
    ) as user_has_voted
  from public.anime_beats_tracks t
  where t.status = 'approved'
  order by t.sort_order desc, t.vote_count desc, t.created_at asc;
$$;

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

  if char_length(normalized_title) < 2 then
    raise exception 'valid title required';
  end if;

  if char_length(normalized_artist) < 2 then
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

create or replace function public.toggle_anime_beats_vote(p_track_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  now_voted boolean := false;
begin
  if auth.uid() is null then
    raise exception 'login required';
  end if;

  if not exists (
    select 1
    from public.anime_beats_tracks
    where id = p_track_id
      and status = 'approved'
  ) then
    raise exception 'track not found';
  end if;

  if exists (
    select 1
    from public.anime_beats_votes
    where track_id = p_track_id
      and user_id = auth.uid()
  ) then
    delete from public.anime_beats_votes
    where track_id = p_track_id
      and user_id = auth.uid();

    update public.anime_beats_tracks
    set vote_count = greatest(vote_count - 1, 0), updated_at = now()
    where id = p_track_id;

    return false;
  end if;

  insert into public.anime_beats_votes (track_id, user_id)
  values (p_track_id, auth.uid());

  update public.anime_beats_tracks
  set vote_count = vote_count + 1, updated_at = now()
  where id = p_track_id;

  return true;
end;
$$;

create or replace function public.list_anime_beats_tracks_admin()
returns setof public.anime_beats_tracks
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  return query
  select *
  from public.anime_beats_tracks
  order by
    case status when 'pending' then 0 when 'approved' then 1 else 2 end,
    created_at desc;
end;
$$;

create or replace function public.review_anime_beats_track(
  p_id uuid,
  p_status text,
  p_sort_order integer default null,
  p_review_note text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  if p_status not in ('approved', 'rejected', 'pending') then
    raise exception 'invalid status';
  end if;

  update public.anime_beats_tracks
  set
    status = p_status,
    sort_order = coalesce(p_sort_order, sort_order),
    review_note = nullif(trim(coalesce(p_review_note, '')), ''),
    reviewed_by = auth.uid(),
    reviewed_at = now(),
    updated_at = now()
  where id = p_id;

  if not found then
    raise exception 'track not found';
  end if;
end;
$$;

create or replace function public.update_anime_beats_track_order(
  p_id uuid,
  p_sort_order integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  update public.anime_beats_tracks
  set sort_order = p_sort_order, updated_at = now()
  where id = p_id
    and status = 'approved';

  if not found then
    raise exception 'approved track not found';
  end if;
end;
$$;

create or replace function public.delete_anime_beats_track(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  delete from public.anime_beats_tracks
  where id = p_id;

  if not found then
    raise exception 'track not found';
  end if;
end;
$$;

create or replace function public.create_anime_beats_track_admin(
  p_title text,
  p_artist text,
  p_youtube_input text,
  p_anime_title text default null,
  p_sort_order integer default 100,
  p_approve boolean default true
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  track_id uuid;
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  insert into public.anime_beats_tracks (
    title,
    artist,
    anime_title,
    youtube_video_id,
    status,
    sort_order,
    submitter_id,
    reviewed_by,
    reviewed_at
  )
  values (
    trim(p_title),
    trim(p_artist),
    nullif(trim(coalesce(p_anime_title, '')), ''),
    public._normalize_youtube_video_id(p_youtube_input),
    case when coalesce(p_approve, true) then 'approved' else 'pending' end,
    coalesce(p_sort_order, 100),
    auth.uid(),
    case when coalesce(p_approve, true) then auth.uid() else null end,
    case when coalesce(p_approve, true) then now() else null end
  )
  returning id into track_id;

  return track_id;
end;
$$;

grant execute on function public.get_anime_beats_playlist() to anon, authenticated;
grant execute on function public.submit_anime_beats_track(text, text, text, text) to authenticated;
grant execute on function public.toggle_anime_beats_vote(uuid) to authenticated;
grant execute on function public.list_anime_beats_tracks_admin() to authenticated;
grant execute on function public.review_anime_beats_track(uuid, text, integer, text) to authenticated;
grant execute on function public.update_anime_beats_track_order(uuid, integer) to authenticated;
grant execute on function public.delete_anime_beats_track(uuid) to authenticated;
grant execute on function public.create_anime_beats_track_admin(text, text, text, text, integer, boolean) to authenticated;

notify pgrst, 'reload schema';
