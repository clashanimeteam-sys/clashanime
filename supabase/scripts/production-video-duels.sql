-- Run in Supabase SQL Editor (production: doqiuduigbdoczdzsima)
-- https://supabase.com/dashboard/project/doqiuduigbdoczdzsima/sql/new

create table if not exists public.video_duels (
  id uuid primary key default gen_random_uuid(),
  challenged_video_id uuid not null references public.videos (id) on delete cascade,
  challenger_video_id uuid not null references public.videos (id) on delete cascade,
  challenger_user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint video_duels_distinct_videos check (challenged_video_id <> challenger_video_id)
);

create index if not exists video_duels_created_at_idx on public.video_duels (created_at desc);
create index if not exists video_duels_challenged_idx on public.video_duels (challenged_video_id);
create index if not exists video_duels_challenger_user_idx on public.video_duels (challenger_user_id);

alter table public.video_duels enable row level security;

drop policy if exists "Anyone can read video duels" on public.video_duels;

create policy "Anyone can read video duels"
  on public.video_duels for select
  using (true);

create or replace function public.create_video_duel(
  p_challenged_video_id uuid,
  p_challenger_video_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  challenger_id uuid := auth.uid();
  challenged_row public.videos%rowtype;
  challenger_row public.videos%rowtype;
  duel_id uuid;
begin
  if challenger_id is null then
    raise exception 'not authenticated';
  end if;

  if p_challenged_video_id is null or p_challenger_video_id is null then
    raise exception 'missing video ids';
  end if;

  if p_challenged_video_id = p_challenger_video_id then
    raise exception 'videos must differ';
  end if;

  select * into challenged_row
  from public.videos
  where id = p_challenged_video_id
    and moderation_status = 'approved';

  if not found then
    raise exception 'challenged video unavailable';
  end if;

  if challenged_row.user_id = challenger_id then
    raise exception 'cannot challenge own video';
  end if;

  select * into challenger_row
  from public.videos
  where id = p_challenger_video_id
    and user_id = challenger_id
    and moderation_status = 'approved';

  if not found then
    raise exception 'challenger video unavailable';
  end if;

  insert into public.video_duels (
    challenged_video_id,
    challenger_video_id,
    challenger_user_id
  )
  values (
    p_challenged_video_id,
    p_challenger_video_id,
    challenger_id
  )
  returning id into duel_id;

  perform public.award_points(challenger_id, 10, 'video_duel_challenge', jsonb_build_object(
    'duel_id', duel_id,
    'challenged_video_id', p_challenged_video_id,
    'challenger_video_id', p_challenger_video_id
  ));

  return duel_id;
end;
$$;

grant execute on function public.create_video_duel(uuid, uuid) to authenticated, service_role;
