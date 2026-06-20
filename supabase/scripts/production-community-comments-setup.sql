-- Production: Community comment replies, likes, and pinned comments
-- Run in Supabase SQL Editor on production: doqiuduigbdoczdzsima

alter table public.community_post_comments
  add column if not exists parent_id uuid references public.community_post_comments (id) on delete cascade,
  add column if not exists likes_count integer not null default 0;

create index if not exists community_post_comments_parent_id_idx
  on public.community_post_comments (parent_id);

alter table public.community_posts
  add column if not exists pinned_comment_id uuid references public.community_post_comments (id) on delete set null;

create table if not exists public.community_post_comment_likes (
  user_id uuid not null references auth.users (id) on delete cascade,
  comment_id uuid not null references public.community_post_comments (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, comment_id)
);

create index if not exists community_post_comment_likes_comment_id_idx
  on public.community_post_comment_likes (comment_id);

alter table public.community_post_comment_likes enable row level security;

drop policy if exists "Anyone can read community comment likes" on public.community_post_comment_likes;
create policy "Anyone can read community comment likes"
  on public.community_post_comment_likes for select
  using (true);

drop policy if exists "Users can like community comments" on public.community_post_comment_likes;
create policy "Users can like community comments"
  on public.community_post_comment_likes for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can unlike community comments" on public.community_post_comment_likes;
create policy "Users can unlike community comments"
  on public.community_post_comment_likes for delete
  using (auth.uid() = user_id);

create or replace function public.sync_community_comment_likes_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.community_post_comments
    set likes_count = likes_count + 1
    where id = new.comment_id;
  elsif tg_op = 'DELETE' then
    update public.community_post_comments
    set likes_count = greatest(likes_count - 1, 0)
    where id = old.comment_id;
  end if;

  return null;
end;
$$;

drop trigger if exists community_post_comment_likes_count_trigger on public.community_post_comment_likes;

create trigger community_post_comment_likes_count_trigger
  after insert or delete on public.community_post_comment_likes
  for each row
  execute function public.sync_community_comment_likes_count();

drop policy if exists "Post owners can pin community comments" on public.community_posts;
create policy "Post owners can pin community comments"
  on public.community_posts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

select
  (select count(*) from information_schema.columns
   where table_schema = 'public' and table_name = 'community_post_comments' and column_name = 'parent_id') as has_parent_id,
  (select count(*) from information_schema.columns
   where table_schema = 'public' and table_name = 'community_posts' and column_name = 'pinned_comment_id') as has_pinned_comment;
