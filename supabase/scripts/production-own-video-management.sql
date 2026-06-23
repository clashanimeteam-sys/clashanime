-- Owner video edit/delete with audit trail for admin dashboard

alter table public.videos
  add column if not exists updated_at timestamptz not null default now();

create or replace function public._touch_video_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists videos_set_updated_at on public.videos;
create trigger videos_set_updated_at
  before update on public.videos
  for each row
  execute function public._touch_video_updated_at();

create table if not exists public.video_owner_events (
  id uuid primary key default gen_random_uuid(),
  video_id uuid references public.videos (id) on delete set null,
  user_id uuid not null references auth.users (id) on delete cascade,
  action text not null check (action in ('update', 'delete')),
  previous_title text,
  new_title text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists video_owner_events_created_at_idx
  on public.video_owner_events (created_at desc);

create index if not exists video_owner_events_user_id_idx
  on public.video_owner_events (user_id, created_at desc);

alter table public.video_owner_events enable row level security;

drop policy if exists "Staff can view video owner events" on public.video_owner_events;
create policy "Staff can view video owner events"
  on public.video_owner_events for select
  using (public.is_staff());

create or replace function public._normalize_video_hashtags(p_hashtags text[])
returns text[]
language sql
immutable
as $$
  select coalesce(
    (
      select array_agg(distinct tag)
      from (
        select lower(trim(both '#' from raw)) as tag
        from unnest(coalesce(p_hashtags, '{}'::text[])) as h(raw)
        where lower(trim(both '#' from raw)) <> ''
        limit 12
      ) normalized
    ),
    '{}'::text[]
  );
$$;

create or replace function public.update_own_video(
  p_video_id uuid,
  p_title text,
  p_hashtags text[]
)
returns public.videos
language plpgsql
security definer
set search_path = public
as $$
declare
  v_video public.videos;
  v_old_title text;
  v_title text;
  v_tags text[];
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  v_title := trim(coalesce(p_title, ''));
  if v_title = '' then
    raise exception 'title required';
  end if;

  select * into v_video
  from public.videos
  where id = p_video_id;

  if not found then
    raise exception 'video not found';
  end if;

  if v_video.user_id is distinct from auth.uid() then
    raise exception 'not allowed';
  end if;

  v_old_title := v_video.title;
  v_tags := public._normalize_video_hashtags(p_hashtags);

  update public.videos
  set
    title = v_title,
    hashtags = v_tags,
    description = (
      select coalesce(string_agg('#' || tag, ' '), '')
      from unnest(v_tags) as tag
    ),
    updated_at = now()
  where id = p_video_id
  returning * into v_video;

  insert into public.video_owner_events (
    video_id,
    user_id,
    action,
    previous_title,
    new_title,
    metadata
  )
  values (
    p_video_id,
    auth.uid(),
    'update',
    v_old_title,
    v_title,
    jsonb_build_object('hashtags', v_tags)
  );

  return v_video;
end;
$$;

create or replace function public.delete_own_video(p_video_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_video public.videos;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  select * into v_video
  from public.videos
  where id = p_video_id;

  if not found then
    raise exception 'video not found';
  end if;

  if v_video.user_id is distinct from auth.uid() then
    raise exception 'not allowed';
  end if;

  insert into public.video_owner_events (
    video_id,
    user_id,
    action,
    previous_title,
    metadata
  )
  values (
    p_video_id,
    auth.uid(),
    'delete',
    v_video.title,
    jsonb_build_object(
      'hashtags', coalesce(v_video.hashtags, '{}'::text[]),
      'moderation_status', v_video.moderation_status
    )
  );

  delete from public.videos
  where id = p_video_id
    and user_id = auth.uid();

  return true;
end;
$$;

grant execute on function public._normalize_video_hashtags(text[]) to anon, authenticated, service_role;
grant execute on function public.update_own_video(uuid, text, text[]) to authenticated, service_role;
grant execute on function public.delete_own_video(uuid) to authenticated, service_role;
