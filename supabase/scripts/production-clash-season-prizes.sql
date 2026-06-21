-- Production: clash season cash prizes per rank.
-- Run in Supabase SQL Editor for project doqiuduigbdoczdzsima.

-- Cash prize amounts per rank for clash seasons.

alter table public.clash_seasons
  add column if not exists prize_rank_1_cents integer not null default 100000,
  add column if not exists prize_rank_2_cents integer not null default 50000,
  add column if not exists prize_rank_3_cents integer not null default 25000;

alter table public.clash_seasons
  drop constraint if exists clash_seasons_prize_rank_1_check,
  drop constraint if exists clash_seasons_prize_rank_2_check,
  drop constraint if exists clash_seasons_prize_rank_3_check;

alter table public.clash_seasons
  add constraint clash_seasons_prize_rank_1_check check (prize_rank_1_cents >= 0),
  add constraint clash_seasons_prize_rank_2_check check (prize_rank_2_cents >= 0),
  add constraint clash_seasons_prize_rank_3_check check (prize_rank_3_cents >= 0);

create or replace function public.get_active_clash_season()
returns table (
  id uuid,
  name text,
  starts_at timestamptz,
  ends_at timestamptz,
  status text,
  prize_rank_1_cents integer,
  prize_rank_2_cents integer,
  prize_rank_3_cents integer
)
language sql
stable
security definer
set search_path = public
as $$
  select
    s.id,
    s.name,
    s.starts_at,
    s.ends_at,
    s.status,
    s.prize_rank_1_cents,
    s.prize_rank_2_cents,
    s.prize_rank_3_cents
  from public.clash_seasons s
  where s.status = 'active'
    and s.ends_at > now()
  order by s.starts_at desc
  limit 1;
$$;

drop function if exists public.create_clash_season(text, timestamptz, timestamptz, boolean);

create or replace function public.create_clash_season(
  p_name text,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_activate boolean default false,
  p_prize_rank_1_cents integer default 100000,
  p_prize_rank_2_cents integer default 50000,
  p_prize_rank_3_cents integer default 25000
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

  if coalesce(p_prize_rank_1_cents, -1) < 0
    or coalesce(p_prize_rank_2_cents, -1) < 0
    or coalesce(p_prize_rank_3_cents, -1) < 0 then
    raise exception 'valid prize amounts required';
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
    prize_rank_1_cents,
    prize_rank_2_cents,
    prize_rank_3_cents,
    created_by
  )
  values (
    normalized_name,
    p_starts_at,
    p_ends_at,
    case when should_activate then 'active' else 'scheduled' end,
    coalesce(p_prize_rank_1_cents, 100000),
    coalesce(p_prize_rank_2_cents, 50000),
    coalesce(p_prize_rank_3_cents, 25000),
    auth.uid()
  )
  returning id into season_id;

  return season_id;
end;
$$;

drop function if exists public.update_clash_season(uuid, text, timestamptz, timestamptz);

create or replace function public.update_clash_season(
  p_id uuid,
  p_name text,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_prize_rank_1_cents integer default null,
  p_prize_rank_2_cents integer default null,
  p_prize_rank_3_cents integer default null
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

  if p_prize_rank_1_cents is not null and p_prize_rank_1_cents < 0 then
    raise exception 'valid prize amounts required';
  end if;

  if p_prize_rank_2_cents is not null and p_prize_rank_2_cents < 0 then
    raise exception 'valid prize amounts required';
  end if;

  if p_prize_rank_3_cents is not null and p_prize_rank_3_cents < 0 then
    raise exception 'valid prize amounts required';
  end if;

  update public.clash_seasons
  set
    name = normalized_name,
    starts_at = p_starts_at,
    ends_at = p_ends_at,
    prize_rank_1_cents = coalesce(p_prize_rank_1_cents, prize_rank_1_cents),
    prize_rank_2_cents = coalesce(p_prize_rank_2_cents, prize_rank_2_cents),
    prize_rank_3_cents = coalesce(p_prize_rank_3_cents, prize_rank_3_cents),
    updated_at = now()
  where id = p_id
    and status <> 'ended';

  if not found then
    raise exception 'season not found or already ended';
  end if;
end;
$$;

create or replace function public.update_clash_season_prizes(
  p_id uuid,
  p_prize_rank_1_cents integer,
  p_prize_rank_2_cents integer,
  p_prize_rank_3_cents integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  if p_prize_rank_1_cents < 0 or p_prize_rank_2_cents < 0 or p_prize_rank_3_cents < 0 then
    raise exception 'valid prize amounts required';
  end if;

  update public.clash_seasons
  set
    prize_rank_1_cents = p_prize_rank_1_cents,
    prize_rank_2_cents = p_prize_rank_2_cents,
    prize_rank_3_cents = p_prize_rank_3_cents,
    updated_at = now()
  where id = p_id
    and status <> 'ended';

  if not found then
    raise exception 'season not found or already ended';
  end if;
end;
$$;

drop function if exists public.start_new_clash_season(text, integer);

create or replace function public.start_new_clash_season(
  p_name text default null,
  p_duration_days integer default 30,
  p_prize_rank_1_cents integer default null,
  p_prize_rank_2_cents integer default null,
  p_prize_rank_3_cents integer default null
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
  prev_prize_1 integer := 100000;
  prev_prize_2 integer := 50000;
  prev_prize_3 integer := 25000;
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  select
    s.prize_rank_1_cents,
    s.prize_rank_2_cents,
    s.prize_rank_3_cents
  into prev_prize_1, prev_prize_2, prev_prize_3
  from public.clash_seasons s
  where s.status = 'active'
  order by s.starts_at desc
  limit 1;

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
    prize_rank_1_cents,
    prize_rank_2_cents,
    prize_rank_3_cents,
    created_by
  )
  values (
    normalized_name,
    now(),
    now() + make_interval(days => duration_days),
    'active',
    coalesce(p_prize_rank_1_cents, prev_prize_1),
    coalesce(p_prize_rank_2_cents, prev_prize_2),
    coalesce(p_prize_rank_3_cents, prev_prize_3),
    auth.uid()
  )
  returning id into season_id;

  return season_id;
end;
$$;

grant execute on function public.get_active_clash_season() to anon, authenticated;
grant execute on function public.create_clash_season(text, timestamptz, timestamptz, boolean, integer, integer, integer) to authenticated;
grant execute on function public.update_clash_season(uuid, text, timestamptz, timestamptz, integer, integer, integer) to authenticated;
grant execute on function public.update_clash_season_prizes(uuid, integer, integer, integer) to authenticated;
grant execute on function public.start_new_clash_season(text, integer, integer, integer, integer) to authenticated;

notify pgrst, 'reload schema';
