-- Clash seasons: countdown on battles page + staff admin controls.

create table if not exists public.clash_seasons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'scheduled'
    check (status in ('scheduled', 'active', 'ended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null,
  constraint clash_seasons_dates_check check (ends_at > starts_at)
);

create index if not exists clash_seasons_status_idx on public.clash_seasons (status);
create index if not exists clash_seasons_ends_at_idx on public.clash_seasons (ends_at desc);

create unique index if not exists clash_seasons_one_active_idx
  on public.clash_seasons (status)
  where status = 'active';

alter table public.clash_seasons enable row level security;

drop policy if exists clash_seasons_staff_select on public.clash_seasons;
create policy clash_seasons_staff_select
  on public.clash_seasons
  for select
  using (public.is_staff());

create or replace function public.get_active_clash_season()
returns table (
  id uuid,
  name text,
  starts_at timestamptz,
  ends_at timestamptz,
  status text
)
language sql
stable
security definer
set search_path = public
as $$
  select s.id, s.name, s.starts_at, s.ends_at, s.status
  from public.clash_seasons s
  where s.status = 'active'
    and s.ends_at > now()
  order by s.starts_at desc
  limit 1;
$$;

create or replace function public.list_clash_seasons()
returns setof public.clash_seasons
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  return query
  select *
  from public.clash_seasons
  order by starts_at desc;
end;
$$;

create or replace function public.create_clash_season(
  p_name text,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_activate boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_name text;
  season_id uuid;
  should_activate boolean := coalesce(p_activate, false);
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  normalized_name := trim(coalesce(p_name, ''));
  if char_length(normalized_name) < 2 then
    raise exception 'valid season name required';
  end if;

  if p_ends_at <= p_starts_at then
    raise exception 'season end must be after start';
  end if;

  if should_activate then
    update public.clash_seasons
    set status = 'ended', updated_at = now()
    where status = 'active';
  end if;

  insert into public.clash_seasons (
    name,
    starts_at,
    ends_at,
    status,
    created_by
  )
  values (
    normalized_name,
    p_starts_at,
    p_ends_at,
    case when should_activate then 'active' else 'scheduled' end,
    auth.uid()
  )
  returning id into season_id;

  return season_id;
end;
$$;

create or replace function public.update_clash_season(
  p_id uuid,
  p_name text,
  p_starts_at timestamptz,
  p_ends_at timestamptz
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_name text;
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  normalized_name := trim(coalesce(p_name, ''));
  if char_length(normalized_name) < 2 then
    raise exception 'valid season name required';
  end if;

  if p_ends_at <= p_starts_at then
    raise exception 'season end must be after start';
  end if;

  update public.clash_seasons
  set
    name = normalized_name,
    starts_at = p_starts_at,
    ends_at = p_ends_at,
    updated_at = now()
  where id = p_id
    and status <> 'ended';

  if not found then
    raise exception 'season not found or already ended';
  end if;
end;
$$;

create or replace function public.activate_clash_season(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  if not exists (
    select 1
    from public.clash_seasons
    where id = p_id
      and status in ('scheduled', 'active')
  ) then
    raise exception 'season not found';
  end if;

  update public.clash_seasons
  set status = 'ended', updated_at = now()
  where status = 'active'
    and id <> p_id;

  update public.clash_seasons
  set status = 'active', updated_at = now()
  where id = p_id;
end;
$$;

create or replace function public.end_clash_season(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  update public.clash_seasons
  set status = 'ended', updated_at = now()
  where id = p_id
    and status = 'active';

  if not found then
    raise exception 'active season not found';
  end if;
end;
$$;

create or replace function public.start_new_clash_season(
  p_name text default null,
  p_duration_days integer default 30
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_name text;
  duration_days integer := greatest(coalesce(p_duration_days, 30), 1);
  season_id uuid;
  next_number integer;
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  update public.clash_seasons
  set status = 'ended', updated_at = now()
  where status = 'active';

  normalized_name := trim(coalesce(p_name, ''));
  if normalized_name = '' then
    select count(*) + 1 into next_number from public.clash_seasons;
    normalized_name := 'Season ' || next_number::text;
  end if;

  insert into public.clash_seasons (
    name,
    starts_at,
    ends_at,
    status,
    created_by
  )
  values (
    normalized_name,
    now(),
    now() + make_interval(days => duration_days),
    'active',
    auth.uid()
  )
  returning id into season_id;

  return season_id;
end;
$$;

insert into public.clash_seasons (name, starts_at, ends_at, status)
select
  'Season 1',
  now(),
  now() + interval '30 days',
  'active'
where not exists (
  select 1
  from public.clash_seasons
  where status = 'active'
);

grant execute on function public.get_active_clash_season() to anon, authenticated;
grant execute on function public.list_clash_seasons() to authenticated;
grant execute on function public.create_clash_season(text, timestamptz, timestamptz, boolean) to authenticated;
grant execute on function public.update_clash_season(uuid, text, timestamptz, timestamptz) to authenticated;
grant execute on function public.activate_clash_season(uuid) to authenticated;
grant execute on function public.end_clash_season(uuid) to authenticated;
grant execute on function public.start_new_clash_season(text, integer) to authenticated;

notify pgrst, 'reload schema';
