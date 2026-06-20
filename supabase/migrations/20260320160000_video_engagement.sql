-- Views and shares counters
alter table public.videos
  add column if not exists views_count integer not null default 0,
  add column if not exists shares_count integer not null default 0;

create index if not exists videos_views_count_idx on public.videos (views_count desc);

-- Likes
create table if not exists public.video_likes (
  user_id uuid not null references auth.users (id) on delete cascade,
  video_id uuid not null references public.videos (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, video_id)
);

create index if not exists video_likes_video_id_idx on public.video_likes (video_id);

alter table public.video_likes enable row level security;

create policy "Anyone can read video likes"
  on public.video_likes for select
  using (true);

create policy "Users can like videos"
  on public.video_likes for insert
  with check (auth.uid() = user_id);

create policy "Users can unlike videos"
  on public.video_likes for delete
  using (auth.uid() = user_id);

-- Comments
create table if not exists public.video_comments (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 500),
  created_at timestamptz not null default now()
);

create index if not exists video_comments_video_id_idx on public.video_comments (video_id);

alter table public.video_comments enable row level security;

create policy "Anyone can read video comments"
  on public.video_comments for select
  using (true);

create policy "Users can post video comments"
  on public.video_comments for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own video comments"
  on public.video_comments for delete
  using (auth.uid() = user_id);

-- Keep aggregate counts in sync
create or replace function public.sync_video_likes_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.videos
    set likes_count = likes_count + 1
    where id = new.video_id;
  elsif tg_op = 'DELETE' then
    update public.videos
    set likes_count = greatest(likes_count - 1, 0)
    where id = old.video_id;
  end if;

  return null;
end;
$$;

drop trigger if exists video_likes_count_trigger on public.video_likes;

create trigger video_likes_count_trigger
  after insert or delete on public.video_likes
  for each row
  execute function public.sync_video_likes_count();

create or replace function public.sync_video_comments_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.videos
    set comments_count = comments_count + 1
    where id = new.video_id;
  elsif tg_op = 'DELETE' then
    update public.videos
    set comments_count = greatest(comments_count - 1, 0)
    where id = old.video_id;
  end if;

  return null;
end;
$$;

drop trigger if exists video_comments_count_trigger on public.video_comments;

create trigger video_comments_count_trigger
  after insert or delete on public.video_comments
  for each row
  execute function public.sync_video_comments_count();

-- Atomic counters for views and shares
create or replace function public.increment_video_views(target_video_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.videos
  set views_count = views_count + 1
  where id = target_video_id;
end;
$$;

create or replace function public.increment_video_shares(target_video_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.videos
  set shares_count = shares_count + 1
  where id = target_video_id;
end;
$$;

grant execute on function public.increment_video_views(uuid) to anon, authenticated;
grant execute on function public.increment_video_shares(uuid) to anon, authenticated;
