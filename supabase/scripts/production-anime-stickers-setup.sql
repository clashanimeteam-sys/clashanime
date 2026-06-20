-- Run in Supabase SQL Editor (production: doqiuduigbdoczdzsima)
-- https://supabase.com/dashboard/project/doqiuduigbdoczdzsima/sql/new
--
-- IMPORTANT: Use THIS file in production — NOT supabase/migrations/20260320191100_anime_stickers.sql
-- Safe to re-run (uses IF NOT EXISTS / DROP POLICY IF EXISTS).

create table if not exists public.anime_sticker_packs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_ar text not null,
  name_ja text not null,
  sort_order smallint not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.anime_stickers (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.anime_sticker_packs (id) on delete cascade,
  slug text not null,
  label text not null default '',
  image_url text not null,
  media_type text not null default 'gif'
    check (media_type in ('gif', 'webp', 'png')),
  sort_order smallint not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (pack_id, slug)
);

create index if not exists anime_stickers_pack_idx on public.anime_stickers (pack_id, sort_order);
create index if not exists anime_sticker_packs_sort_idx on public.anime_sticker_packs (sort_order);

alter table public.anime_sticker_packs enable row level security;
alter table public.anime_stickers enable row level security;

drop policy if exists "Anyone can read active sticker packs" on public.anime_sticker_packs;
create policy "Anyone can read active sticker packs"
  on public.anime_sticker_packs for select
  using (active = true or public.is_staff());

drop policy if exists "Staff manage sticker packs" on public.anime_sticker_packs;
create policy "Staff manage sticker packs"
  on public.anime_sticker_packs for all
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "Anyone can read active stickers" on public.anime_stickers;
create policy "Anyone can read active stickers"
  on public.anime_stickers for select
  using (
    active = true
    and exists (
      select 1
      from public.anime_sticker_packs p
      where p.id = pack_id
        and p.active = true
    )
    or public.is_staff()
  );

drop policy if exists "Staff manage stickers" on public.anime_stickers;
create policy "Staff manage stickers"
  on public.anime_stickers for all
  using (public.is_staff())
  with check (public.is_staff());

insert into storage.buckets (id, name, public)
values ('anime-stickers', 'anime-stickers', true)
on conflict (id) do nothing;

drop policy if exists "Public read anime stickers" on storage.objects;
create policy "Public read anime stickers"
  on storage.objects for select
  using (bucket_id = 'anime-stickers');

drop policy if exists "Staff upload anime stickers" on storage.objects;
create policy "Staff upload anime stickers"
  on storage.objects for insert
  with check (bucket_id = 'anime-stickers' and public.is_staff());

drop policy if exists "Staff update anime stickers" on storage.objects;
create policy "Staff update anime stickers"
  on storage.objects for update
  using (bucket_id = 'anime-stickers' and public.is_staff());

drop policy if exists "Staff delete anime stickers" on storage.objects;
create policy "Staff delete anime stickers"
  on storage.objects for delete
  using (bucket_id = 'anime-stickers' and public.is_staff());

insert into public.anime_sticker_packs (slug, name_en, name_ar, name_ja, sort_order)
values ('reactions', 'Reactions', 'ردود فعل', 'リアクション', 0)
on conflict (slug) do nothing;

select
  (select count(*) from public.anime_sticker_packs) as pack_count,
  (select count(*) from public.anime_stickers) as sticker_count,
  (select count(*) from storage.buckets where id = 'anime-stickers') as bucket_count;

-- Next step: run production-anime-stickers-seed.sql to insert the default reaction GIFs.
