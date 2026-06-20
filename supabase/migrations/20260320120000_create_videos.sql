-- ClashAnime videos table
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  thumbnail_url text not null,
  video_url text not null default '',
  likes_count integer not null default 0,
  comments_count integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.videos enable row level security;

create policy "Videos are viewable by everyone"
  on public.videos for select
  using (true);

create policy "Authenticated users can insert videos"
  on public.videos for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update own videos"
  on public.videos for update
  using (auth.role() = 'authenticated');

create index if not exists videos_likes_count_idx on public.videos (likes_count desc);
create index if not exists videos_created_at_idx on public.videos (created_at desc);

-- Realtime
alter publication supabase_realtime add table public.videos;
