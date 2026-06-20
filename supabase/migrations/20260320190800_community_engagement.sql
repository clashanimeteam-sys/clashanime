-- Community post images, reactions, comments, reports, and storage

alter table public.community_posts
  add column if not exists image_url text,
  add column if not exists likes_count integer not null default 0,
  add column if not exists dislikes_count integer not null default 0,
  add column if not exists comments_count integer not null default 0,
  add column if not exists shares_count integer not null default 0;

alter table public.community_posts
  alter column body drop not null;

alter table public.community_posts
  drop constraint if exists community_posts_body_check;

alter table public.community_posts
  add constraint community_posts_content_check
  check (
    (
      image_url is not null
      and char_length(trim(coalesce(body, ''))) <= 2000
      and (
        char_length(trim(coalesce(body, ''))) >= 1
        or char_length(trim(coalesce(image_url, ''))) > 0
      )
    )
    or char_length(trim(coalesce(body, ''))) between 1 and 2000
  );

create table if not exists public.community_post_reactions (
  post_id uuid not null references public.community_posts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  reaction text not null check (reaction in ('like', 'dislike')),
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index if not exists community_post_reactions_post_id_idx
  on public.community_post_reactions (post_id);

alter table public.community_post_reactions enable row level security;

create policy "Anyone can read community post reactions"
  on public.community_post_reactions for select
  using (true);

create policy "Users can react to community posts"
  on public.community_post_reactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own community post reactions"
  on public.community_post_reactions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can remove own community post reactions"
  on public.community_post_reactions for delete
  using (auth.uid() = user_id);

create table if not exists public.community_post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 500),
  created_at timestamptz not null default now()
);

create index if not exists community_post_comments_post_id_idx
  on public.community_post_comments (post_id);

alter table public.community_post_comments enable row level security;

create policy "Anyone can read community post comments"
  on public.community_post_comments for select
  using (true);

create policy "Users can post community comments"
  on public.community_post_comments for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own community post comments"
  on public.community_post_comments for delete
  using (auth.uid() = user_id);

create policy "Staff can delete community post comments"
  on public.community_post_comments for delete
  using (public.is_staff());

alter table public.content_reports
  alter column video_id drop not null;

alter table public.content_reports
  add column if not exists post_id uuid references public.community_posts (id) on delete cascade;

create index if not exists content_reports_post_id_idx on public.content_reports (post_id);

alter table public.content_reports
  drop constraint if exists content_reports_target_check;

alter table public.content_reports
  add constraint content_reports_target_check
  check (
    (video_id is not null and post_id is null)
    or (video_id is null and post_id is not null)
  );

create policy "Staff can delete community posts"
  on public.community_posts for delete
  using (public.is_staff());

insert into storage.buckets (id, name, public)
values ('community-images', 'community-images', true)
on conflict (id) do nothing;

create policy "Public read community images"
  on storage.objects for select
  using (bucket_id = 'community-images');

create policy "Users upload own community images"
  on storage.objects for insert
  with check (
    bucket_id = 'community-images'
    and auth.uid()::text = (storage.foldername (name))[1]
  );

create policy "Users update own community images"
  on storage.objects for update
  using (
    bucket_id = 'community-images'
    and auth.uid()::text = (storage.foldername (name))[1]
  );

create policy "Users delete own community images"
  on storage.objects for delete
  using (
    bucket_id = 'community-images'
    and auth.uid()::text = (storage.foldername (name))[1]
  );

create or replace function public.sync_community_post_reaction_counts()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if new.reaction = 'like' then
      update public.community_posts
      set likes_count = likes_count + 1
      where id = new.post_id;
    else
      update public.community_posts
      set dislikes_count = dislikes_count + 1
      where id = new.post_id;
    end if;
  elsif tg_op = 'DELETE' then
    if old.reaction = 'like' then
      update public.community_posts
      set likes_count = greatest(likes_count - 1, 0)
      where id = old.post_id;
    else
      update public.community_posts
      set dislikes_count = greatest(dislikes_count - 1, 0)
      where id = old.post_id;
    end if;
  elsif tg_op = 'UPDATE' then
    if old.reaction = 'like' and new.reaction = 'dislike' then
      update public.community_posts
      set likes_count = greatest(likes_count - 1, 0),
          dislikes_count = dislikes_count + 1
      where id = new.post_id;
    elsif old.reaction = 'dislike' and new.reaction = 'like' then
      update public.community_posts
      set dislikes_count = greatest(dislikes_count - 1, 0),
          likes_count = likes_count + 1
      where id = new.post_id;
    end if;
  end if;

  return coalesce(new, old);
end;
$$;

drop trigger if exists community_post_reactions_count_trigger on public.community_post_reactions;

create trigger community_post_reactions_count_trigger
  after insert or update or delete on public.community_post_reactions
  for each row
  execute function public.sync_community_post_reaction_counts();

create or replace function public.sync_community_post_comments_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.community_posts
    set comments_count = comments_count + 1
    where id = new.post_id;
  elsif tg_op = 'DELETE' then
    update public.community_posts
    set comments_count = greatest(comments_count - 1, 0)
    where id = old.post_id;
  end if;

  return null;
end;
$$;

drop trigger if exists community_post_comments_count_trigger on public.community_post_comments;

create trigger community_post_comments_count_trigger
  after insert or delete on public.community_post_comments
  for each row
  execute function public.sync_community_post_comments_count();

create or replace function public.increment_community_post_shares(target_post_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.community_posts
  set shares_count = shares_count + 1
  where id = target_post_id;
end;
$$;

grant execute on function public.increment_community_post_shares(uuid) to anon, authenticated;
