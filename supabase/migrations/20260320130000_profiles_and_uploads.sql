-- User profiles for channel pages
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  display_name text,
  avatar_url text,
  banner_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Extend videos for user uploads
alter table public.videos
  add column if not exists user_id uuid references auth.users (id) on delete set null,
  add column if not exists hashtags text[] not null default '{}',
  add column if not exists duration_seconds integer,
  add column if not exists description text not null default '';

create index if not exists videos_user_id_idx on public.videos (user_id);

drop policy if exists "Authenticated users can update own videos" on public.videos;

create policy "Users can update own videos"
  on public.videos for update
  using (auth.uid() = user_id);

create policy "Users can delete own videos"
  on public.videos for delete
  using (auth.uid() = user_id);

drop policy if exists "Authenticated users can insert videos" on public.videos;

create policy "Users can insert own videos"
  on public.videos for insert
  with check (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  final_username text;
begin
  base_username := lower(
    regexp_replace(
      coalesce(split_part(new.email, '@', 1), 'clash'),
      '[^a-z0-9_]',
      '',
      'g'
    )
  );

  if base_username = '' then
    base_username := 'clash';
  end if;

  final_username := base_username || substr(replace(new.id::text, '-', ''), 1, 4);

  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    final_username,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', base_username)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Storage buckets
insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('banners', 'banners', true),
  ('clips', 'clips', true),
  ('thumbnails', 'thumbnails', true)
on conflict (id) do nothing;

create policy "Public read avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Public read banners"
  on storage.objects for select
  using (bucket_id = 'banners');

create policy "Public read clips"
  on storage.objects for select
  using (bucket_id = 'clips');

create policy "Public read thumbnails"
  on storage.objects for select
  using (bucket_id = 'thumbnails');

create policy "Users upload own avatars"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername (name))[1]
  );

create policy "Users update own avatars"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername (name))[1]
  );

create policy "Users upload own banners"
  on storage.objects for insert
  with check (
    bucket_id = 'banners'
    and auth.uid()::text = (storage.foldername (name))[1]
  );

create policy "Users update own banners"
  on storage.objects for update
  using (
    bucket_id = 'banners'
    and auth.uid()::text = (storage.foldername (name))[1]
  );

create policy "Users upload own clips"
  on storage.objects for insert
  with check (
    bucket_id = 'clips'
    and auth.uid()::text = (storage.foldername (name))[1]
  );

create policy "Users upload own thumbnails"
  on storage.objects for insert
  with check (
    bucket_id = 'thumbnails'
    and auth.uid()::text = (storage.foldername (name))[1]
  );
