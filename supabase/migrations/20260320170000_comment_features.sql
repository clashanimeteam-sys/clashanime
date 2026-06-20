-- Replies, comment likes, and pinned comments
alter table public.video_comments
  add column if not exists parent_id uuid references public.video_comments (id) on delete cascade,
  add column if not exists likes_count integer not null default 0;

create index if not exists video_comments_parent_id_idx on public.video_comments (parent_id);

alter table public.videos
  add column if not exists pinned_comment_id uuid references public.video_comments (id) on delete set null;

create table if not exists public.video_comment_likes (
  user_id uuid not null references auth.users (id) on delete cascade,
  comment_id uuid not null references public.video_comments (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, comment_id)
);

create index if not exists video_comment_likes_comment_id_idx
  on public.video_comment_likes (comment_id);

alter table public.video_comment_likes enable row level security;

create policy "Anyone can read comment likes"
  on public.video_comment_likes for select
  using (true);

create policy "Users can like comments"
  on public.video_comment_likes for insert
  with check (auth.uid() = user_id);

create policy "Users can unlike comments"
  on public.video_comment_likes for delete
  using (auth.uid() = user_id);

create or replace function public.sync_comment_likes_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.video_comments
    set likes_count = likes_count + 1
    where id = new.comment_id;
  elsif tg_op = 'DELETE' then
    update public.video_comments
    set likes_count = greatest(likes_count - 1, 0)
    where id = old.comment_id;
  end if;

  return null;
end;
$$;

drop trigger if exists video_comment_likes_count_trigger on public.video_comment_likes;

create trigger video_comment_likes_count_trigger
  after insert or delete on public.video_comment_likes
  for each row
  execute function public.sync_comment_likes_count();

drop policy if exists "Video owners can pin comments" on public.videos;

create policy "Video owners can pin comments"
  on public.videos for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
