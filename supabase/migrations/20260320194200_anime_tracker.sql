-- Anime Tracker: real release schedule + auto-open release clashes

create table if not exists public.anime_release_clashes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  status text not null default 'active'
    check (status in ('active', 'ended')),
  match_tags text[] not null default '{}',
  opens_at timestamptz not null default now(),
  closes_at timestamptz,
  notification_sent boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists anime_release_clashes_status_idx
  on public.anime_release_clashes (status, opens_at desc);

create table if not exists public.anime_releases (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_ar text,
  title_ja text,
  anilist_id integer,
  release_date date not null,
  airs_at timestamptz,
  episode_number integer not null default 1,
  poster_url text,
  match_tags text[] not null default '{}',
  status text not null default 'scheduled'
    check (status in ('scheduled', 'released', 'cancelled')),
  clash_id uuid references public.anime_release_clashes (id) on delete set null,
  source text not null default 'manual'
    check (source in ('manual', 'anilist')),
  notes text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists anime_releases_anilist_episode_uidx
  on public.anime_releases (anilist_id, episode_number)
  where anilist_id is not null;

create index if not exists anime_releases_release_date_idx
  on public.anime_releases (release_date desc, status);

create index if not exists anime_releases_clash_idx
  on public.anime_releases (clash_id)
  where clash_id is not null;

alter table public.anime_release_clashes enable row level security;
alter table public.anime_releases enable row level security;

drop policy if exists anime_release_clashes_public_select on public.anime_release_clashes;
create policy anime_release_clashes_public_select
  on public.anime_release_clashes
  for select
  using (true);

drop policy if exists anime_releases_public_select on public.anime_releases;
create policy anime_releases_public_select
  on public.anime_releases
  for select
  using (status <> 'cancelled' or public.is_staff());

create or replace function public._normalize_anime_match_tags(p_tags text[], p_title text default null)
returns text[]
language plpgsql
immutable
as $$
declare
  raw_tags text[] := coalesce(p_tags, '{}'::text[]);
  normalized text[] := '{}'::text[];
  tag text;
  slug text;
begin
  foreach tag in array raw_tags loop
    slug := lower(regexp_replace(trim(both '#' from coalesce(tag, '')), '[^a-z0-9]+', '', 'g'));
    if slug <> '' and not slug = any(normalized) then
      normalized := array_append(normalized, slug);
    end if;
  end loop;

  if p_title is not null and trim(p_title) <> '' then
    slug := lower(regexp_replace(trim(p_title), '[^a-z0-9]+', '', 'g'));
    if slug <> '' and not slug = any(normalized) then
      normalized := array_append(normalized, slug);
    end if;
  end if;

  return normalized;
end;
$$;

create or replace function public._video_matches_anime_tags(p_hashtags text[], p_match_tags text[])
returns boolean
language sql
immutable
as $$
  select exists (
    select 1
    from unnest(coalesce(p_hashtags, '{}'::text[])) as h(tag)
    where lower(regexp_replace(trim(both '#' from coalesce(h.tag, '')), '[^a-z0-9]+', '', 'g'))
      = any(coalesce(p_match_tags, '{}'::text[]))
  )
  or exists (
    select 1
    from unnest(coalesce(p_hashtags, '{}'::text[])) as h(tag)
    where lower(trim(both '#' from coalesce(h.tag, ''))) = any(coalesce(p_match_tags, '{}'::text[]))
  );
$$;

create or replace function public.open_anime_release_clash(p_release_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_release public.anime_releases%rowtype;
  v_clash_id uuid;
  v_clash_title text;
  v_link text;
begin
  select * into v_release
  from public.anime_releases
  where id = p_release_id
  for update;

  if not found then
    raise exception 'release not found';
  end if;

  if v_release.status = 'cancelled' then
    raise exception 'release is cancelled';
  end if;

  if v_release.clash_id is not null then
    return v_release.clash_id;
  end if;

  v_clash_title := trim(v_release.title) || ' · Ep ' || coalesce(v_release.episode_number, 1)::text;

  insert into public.anime_release_clashes (
    title,
    status,
    match_tags,
    opens_at,
    closes_at
  )
  values (
    v_clash_title,
    'active',
    public._normalize_anime_match_tags(v_release.match_tags, v_release.title),
    now(),
    now() + interval '7 days'
  )
  returning id into v_clash_id;

  update public.anime_releases
  set
    status = 'released',
    clash_id = v_clash_id,
    updated_at = now()
  where id = p_release_id;

  v_link := '/tracker/clash/' || v_clash_id::text;

  perform public._notify_all_users(
    'anime_release_clash',
    'New anime release clash',
    v_clash_title || ' just dropped. Submit your best clip!',
    v_link,
    jsonb_build_object(
      'release_id', p_release_id,
      'clash_id', v_clash_id,
      'anime_title', v_release.title,
      'episode_number', v_release.episode_number
    )
  );

  update public.anime_release_clashes
  set notification_sent = true
  where id = v_clash_id;

  return v_clash_id;
end;
$$;

create or replace function public.process_due_anime_release_clashes()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer := 0;
  r record;
begin
  for r in
    select ar.id
    from public.anime_releases ar
    where ar.status = 'scheduled'
      and ar.clash_id is null
      and (
        ar.release_date <= current_date
        or (ar.airs_at is not null and ar.airs_at <= now())
      )
    order by ar.release_date asc, ar.airs_at asc nulls last
  loop
    perform public.open_anime_release_clash(r.id);
    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;

create or replace function public.get_anime_tracker_today()
returns table (
  id uuid,
  title text,
  title_ar text,
  title_ja text,
  release_date date,
  airs_at timestamptz,
  episode_number integer,
  poster_url text,
  match_tags text[],
  status text,
  clash_id uuid,
  clash_status text,
  clash_opens_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    ar.id,
    ar.title,
    ar.title_ar,
    ar.title_ja,
    ar.release_date,
    ar.airs_at,
    ar.episode_number,
    ar.poster_url,
    ar.match_tags,
    ar.status,
    ar.clash_id,
    c.status as clash_status,
    c.opens_at as clash_opens_at
  from public.anime_releases ar
  left join public.anime_release_clashes c on c.id = ar.clash_id
  where ar.status <> 'cancelled'
    and ar.release_date = current_date
  order by coalesce(ar.airs_at, ar.release_date::timestamptz) asc, ar.title asc;
$$;

create or replace function public.get_anime_tracker_upcoming(p_days integer default 14)
returns table (
  id uuid,
  title text,
  title_ar text,
  title_ja text,
  release_date date,
  airs_at timestamptz,
  episode_number integer,
  poster_url text,
  status text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    ar.id,
    ar.title,
    ar.title_ar,
    ar.title_ja,
    ar.release_date,
    ar.airs_at,
    ar.episode_number,
    ar.poster_url,
    ar.status
  from public.anime_releases ar
  where ar.status = 'scheduled'
    and ar.release_date > current_date
    and ar.release_date <= current_date + make_interval(days => greatest(coalesce(p_days, 14), 1))
  order by ar.release_date asc, ar.title asc;
$$;

create or replace function public.get_active_anime_release_clashes()
returns table (
  clash_id uuid,
  clash_title text,
  release_id uuid,
  anime_title text,
  title_ar text,
  title_ja text,
  episode_number integer,
  poster_url text,
  match_tags text[],
  opens_at timestamptz,
  closes_at timestamptz,
  clip_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    c.id as clash_id,
    c.title as clash_title,
    ar.id as release_id,
    ar.title as anime_title,
    ar.title_ar,
    ar.title_ja,
    ar.episode_number,
    ar.poster_url,
    c.match_tags,
    c.opens_at,
    c.closes_at,
    (
      select count(*)
      from public.videos v
      where v.moderation_status = 'approved'
        and public._video_matches_anime_tags(v.hashtags, c.match_tags)
    ) as clip_count
  from public.anime_release_clashes c
  join public.anime_releases ar on ar.clash_id = c.id
  where c.status = 'active'
    and (c.closes_at is null or c.closes_at > now())
  order by c.opens_at desc;
$$;

create or replace function public.get_anime_release_clash_detail(p_clash_id uuid)
returns table (
  clash_id uuid,
  clash_title text,
  release_id uuid,
  anime_title text,
  title_ar text,
  title_ja text,
  episode_number integer,
  poster_url text,
  match_tags text[],
  opens_at timestamptz,
  closes_at timestamptz,
  clash_status text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    c.id as clash_id,
    c.title as clash_title,
    ar.id as release_id,
    ar.title as anime_title,
    ar.title_ar,
    ar.title_ja,
    ar.episode_number,
    ar.poster_url,
    c.match_tags,
    c.opens_at,
    c.closes_at,
    c.status as clash_status
  from public.anime_release_clashes c
  join public.anime_releases ar on ar.clash_id = c.id
  where c.id = p_clash_id;
$$;

create or replace function public.get_anime_release_clash_videos(p_clash_id uuid, p_limit integer default 24)
returns table (
  id uuid,
  title text,
  thumbnail_url text,
  video_url text,
  likes_count integer,
  comments_count integer,
  created_at timestamptz,
  user_id uuid,
  hashtags text[],
  rank_position bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with ranked as (
    select
      v.id,
      v.title,
      v.thumbnail_url,
      v.video_url,
      v.likes_count,
      v.comments_count,
      v.created_at,
      v.user_id,
      v.hashtags,
      row_number() over (
        order by (v.likes_count + v.comments_count * 2) desc, v.created_at desc
      ) as rank_position
    from public.anime_release_clashes c
    join public.videos v on v.moderation_status = 'approved'
      and public._video_matches_anime_tags(v.hashtags, c.match_tags)
    where c.id = p_clash_id
  )
  select *
  from ranked
  order by rank_position asc
  limit greatest(coalesce(p_limit, 24), 1);
$$;

create or replace function public.list_anime_releases_admin()
returns table (
  id uuid,
  title text,
  title_ar text,
  title_ja text,
  anilist_id integer,
  release_date date,
  airs_at timestamptz,
  episode_number integer,
  poster_url text,
  match_tags text[],
  status text,
  source text,
  clash_id uuid,
  notes text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    ar.id,
    ar.title,
    ar.title_ar,
    ar.title_ja,
    ar.anilist_id,
    ar.release_date,
    ar.airs_at,
    ar.episode_number,
    ar.poster_url,
    ar.match_tags,
    ar.status,
    ar.source,
    ar.clash_id,
    ar.notes,
    ar.created_at
  from public.anime_releases ar
  order by ar.release_date desc, ar.created_at desc;
$$;

create or replace function public.create_anime_release_admin(
  p_title text,
  p_release_date date,
  p_title_ar text default null,
  p_title_ja text default null,
  p_episode_number integer default 1,
  p_poster_url text default null,
  p_match_tags text[] default '{}'::text[],
  p_airs_at timestamptz default null,
  p_anilist_id integer default null,
  p_notes text default null,
  p_open_clash boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_tags text[];
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  if trim(coalesce(p_title, '')) = '' then
    raise exception 'title required';
  end if;

  if p_release_date is null then
    raise exception 'release date required';
  end if;

  v_tags := public._normalize_anime_match_tags(p_match_tags, p_title);

  insert into public.anime_releases (
    title,
    title_ar,
    title_ja,
    anilist_id,
    release_date,
    airs_at,
    episode_number,
    poster_url,
    match_tags,
    source,
    notes,
    created_by
  )
  values (
    trim(p_title),
    nullif(trim(coalesce(p_title_ar, '')), ''),
    nullif(trim(coalesce(p_title_ja, '')), ''),
    p_anilist_id,
    p_release_date,
    p_airs_at,
    greatest(coalesce(p_episode_number, 1), 1),
    nullif(trim(coalesce(p_poster_url, '')), ''),
    v_tags,
    case when p_anilist_id is not null then 'anilist' else 'manual' end,
    nullif(trim(coalesce(p_notes, '')), ''),
    auth.uid()
  )
  returning id into v_id;

  if coalesce(p_open_clash, false) then
    perform public.open_anime_release_clash(v_id);
  end if;

  return v_id;
end;
$$;

create or replace function public.update_anime_release_admin(
  p_id uuid,
  p_title text default null,
  p_title_ar text default null,
  p_title_ja text default null,
  p_release_date date default null,
  p_airs_at timestamptz default null,
  p_episode_number integer default null,
  p_poster_url text default null,
  p_match_tags text[] default null,
  p_status text default null,
  p_notes text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_release public.anime_releases%rowtype;
  v_tags text[];
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  select * into v_release from public.anime_releases where id = p_id;
  if not found then
    raise exception 'release not found';
  end if;

  v_tags := case
    when p_match_tags is not null then public._normalize_anime_match_tags(p_match_tags, coalesce(p_title, v_release.title))
    else v_release.match_tags
  end;

  update public.anime_releases
  set
    title = coalesce(nullif(trim(p_title), ''), title),
    title_ar = case when p_title_ar is not null then nullif(trim(p_title_ar), '') else title_ar end,
    title_ja = case when p_title_ja is not null then nullif(trim(p_title_ja), '') else title_ja end,
    release_date = coalesce(p_release_date, release_date),
    airs_at = case when p_airs_at is not null then p_airs_at else airs_at end,
    episode_number = coalesce(p_episode_number, episode_number),
    poster_url = case when p_poster_url is not null then nullif(trim(p_poster_url), '') else poster_url end,
    match_tags = v_tags,
    status = coalesce(p_status, status),
    notes = case when p_notes is not null then nullif(trim(p_notes), '') else notes end,
    updated_at = now()
  where id = p_id;
end;
$$;

create or replace function public.delete_anime_release_admin(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  delete from public.anime_releases where id = p_id;
end;
$$;

create or replace function public.open_anime_release_clash_admin(p_release_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  return public.open_anime_release_clash(p_release_id);
end;
$$;

create or replace function public.upsert_anime_release_from_sync(
  p_anilist_id integer,
  p_title text,
  p_release_date date,
  p_episode_number integer,
  p_airs_at timestamptz default null,
  p_poster_url text default null,
  p_title_ja text default null,
  p_match_tags text[] default '{}'::text[]
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_tags text[];
begin
  if p_anilist_id is null or trim(coalesce(p_title, '')) = '' then
    raise exception 'anilist id and title required';
  end if;

  v_tags := public._normalize_anime_match_tags(p_match_tags, p_title);

  insert into public.anime_releases (
    title,
    title_ja,
    anilist_id,
    release_date,
    airs_at,
    episode_number,
    poster_url,
    match_tags,
    source
  )
  values (
    trim(p_title),
    nullif(trim(coalesce(p_title_ja, '')), ''),
    p_anilist_id,
    p_release_date,
    p_airs_at,
    greatest(coalesce(p_episode_number, 1), 1),
    nullif(trim(coalesce(p_poster_url, '')), ''),
    v_tags,
    'anilist'
  )
  on conflict (anilist_id, episode_number) where anilist_id is not null
  do update set
    title = excluded.title,
    title_ja = excluded.title_ja,
    release_date = excluded.release_date,
    airs_at = excluded.airs_at,
    poster_url = coalesce(excluded.poster_url, anime_releases.poster_url),
    match_tags = excluded.match_tags,
    updated_at = now()
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.get_anime_tracker_today() to anon, authenticated, service_role;
grant execute on function public.get_anime_tracker_upcoming(integer) to anon, authenticated, service_role;
grant execute on function public.get_active_anime_release_clashes() to anon, authenticated, service_role;
grant execute on function public.get_anime_release_clash_detail(uuid) to anon, authenticated, service_role;
grant execute on function public.get_anime_release_clash_videos(uuid, integer) to anon, authenticated, service_role;
grant execute on function public.list_anime_releases_admin() to authenticated, service_role;
grant execute on function public.create_anime_release_admin(text, date, text, text, integer, text, text[], timestamptz, integer, text, boolean) to authenticated, service_role;
grant execute on function public.update_anime_release_admin(uuid, text, text, text, date, timestamptz, integer, text, text[], text, text) to authenticated, service_role;
grant execute on function public.delete_anime_release_admin(uuid) to authenticated, service_role;
grant execute on function public.open_anime_release_clash_admin(uuid) to authenticated, service_role;
grant execute on function public.process_due_anime_release_clashes() to service_role;
grant execute on function public.upsert_anime_release_from_sync(integer, text, date, integer, timestamptz, text, text, text[]) to service_role;

notify pgrst, 'reload schema';
