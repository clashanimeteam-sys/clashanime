-- Featured anime spotlight catalog (posters, synopses, trailers)

create table if not exists public.anime_spotlight_catalog (
  id text primary key default 'main',
  entries jsonb not null default '[]'::jsonb,
  synced_at timestamptz,
  updated_at timestamptz not null default now()
);

insert into public.anime_spotlight_catalog (id, entries)
values ('main', '[]'::jsonb)
on conflict (id) do nothing;

create index if not exists anime_spotlight_catalog_entries_gin_idx
  on public.anime_spotlight_catalog using gin (entries);

alter table public.anime_spotlight_catalog enable row level security;

drop policy if exists anime_spotlight_public_select on public.anime_spotlight_catalog;
create policy anime_spotlight_public_select
  on public.anime_spotlight_catalog
  for select
  using (true);

drop policy if exists anime_spotlight_staff_all on public.anime_spotlight_catalog;
create policy anime_spotlight_staff_all
  on public.anime_spotlight_catalog
  for all
  using (public.is_staff())
  with check (public.is_staff());

create or replace function public.get_anime_spotlight_catalog()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select entries
  from public.anime_spotlight_catalog
  where id = 'main'
  limit 1;
$$;

grant execute on function public.get_anime_spotlight_catalog() to anon, authenticated;

notify pgrst, 'reload schema';
