-- Channel follows (followers)
create table if not exists public.channel_follows (
  follower_id uuid not null references auth.users (id) on delete cascade,
  following_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  constraint channel_follows_no_self_follow check (follower_id <> following_id)
);

create index if not exists channel_follows_following_id_idx
  on public.channel_follows (following_id);

create index if not exists channel_follows_follower_id_idx
  on public.channel_follows (follower_id);

alter table public.channel_follows enable row level security;

create policy "Anyone can read channel follows"
  on public.channel_follows for select
  using (true);

create policy "Users can follow channels"
  on public.channel_follows for insert
  with check (auth.uid() = follower_id and auth.uid() <> following_id);

create policy "Users can unfollow channels"
  on public.channel_follows for delete
  using (auth.uid() = follower_id);
