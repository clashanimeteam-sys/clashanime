-- Hall of Legends: permanent archive of past season winners.

create table if not exists public.clash_season_winners (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.clash_seasons (id) on delete cascade,
  rank smallint not null check (rank between 1 and 3),
  user_id uuid not null references public.profiles (id) on delete cascade,
  video_id uuid references public.videos (id) on delete set null,
  video_title text,
  thumbnail_url text,
  prize_cents integer not null default 0 check (prize_cents >= 0),
  trending_score numeric,
  finalized_at timestamptz not null default now(),
  finalized_by uuid references auth.users (id) on delete set null,
  constraint clash_season_winners_season_rank_unique unique (season_id, rank)
);

create index if not exists clash_season_winners_season_idx
  on public.clash_season_winners (season_id);

create index if not exists clash_season_winners_user_idx
  on public.clash_season_winners (user_id);

alter table public.clash_season_winners enable row level security;

drop policy if exists clash_season_winners_public_select on public.clash_season_winners;
create policy clash_season_winners_public_select
  on public.clash_season_winners
  for select
  using (true);

create or replace function public._clash_video_trending_score(
  p_likes integer,
  p_comments integer,
  p_created_at timestamptz,
  p_is_verified boolean,
  p_level smallint
)
returns numeric
language sql
immutable
as $$
  select
    (
      (greatest(coalesce(p_likes, 0), 0) + greatest(coalesce(p_comments, 0), 0) * 2)
      * case
          when coalesce(p_is_verified, false) or coalesce(p_level, 1) >= 4 then 1.2
          else 1.0
        end
    )
    / power(
      greatest(
        extract(epoch from (now() - p_created_at)) / 3600.0 + 2.0,
        0.01
      ),
      1.5
    );
$$;

create or replace function public.snapshot_season_winners(p_season_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  season_row public.clash_seasons%rowtype;
  prize_cents integer[];
  inserted_count integer := 0;
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  select * into season_row
  from public.clash_seasons
  where id = p_season_id;

  if not found then
    raise exception 'season not found';
  end if;

  if season_row.status <> 'ended' then
    raise exception 'season must be ended before archiving winners';
  end if;

  prize_cents := array[
    season_row.prize_rank_1_cents,
    season_row.prize_rank_2_cents,
    season_row.prize_rank_3_cents
  ];

  delete from public.clash_season_winners
  where season_id = p_season_id;

  with ranked as (
    select
      row_number() over (order by score desc, v.created_at asc) as season_rank,
      v.id as video_id,
      v.user_id,
      v.title as video_title,
      v.thumbnail_url,
      score
    from (
      select
        v.*,
        public._clash_video_trending_score(
          v.likes_count,
          v.comments_count,
          v.created_at,
          coalesce(p.is_verified, false),
          coalesce(p.level, 1)
        ) as score
      from public.videos v
      left join public.profiles p on p.id = v.user_id
      where v.moderation_status = 'approved'
        and v.user_id is not null
        and v.created_at >= season_row.starts_at
        and v.created_at <= season_row.ends_at
    ) v
    where v.user_id is not null
  )
  insert into public.clash_season_winners (
    season_id,
    rank,
    user_id,
    video_id,
    video_title,
    thumbnail_url,
    prize_cents,
    trending_score,
    finalized_by
  )
  select
    p_season_id,
    ranked.season_rank::smallint,
    ranked.user_id,
    ranked.video_id,
    ranked.video_title,
    ranked.thumbnail_url,
    prize_cents[ranked.season_rank],
    ranked.score,
    auth.uid()
  from ranked
  where ranked.season_rank <= 3;

  get diagnostics inserted_count = row_count;
  return inserted_count;
end;
$$;

create or replace function public.get_hall_of_legends(p_limit integer default 12)
returns table (
  season_id uuid,
  season_name text,
  season_ends_at timestamptz,
  rank smallint,
  user_id uuid,
  username text,
  display_name text,
  avatar_url text,
  video_id uuid,
  video_title text,
  thumbnail_url text,
  prize_cents integer
)
language sql
stable
security definer
set search_path = public
as $$
  with recent_seasons as (
    select s.id, s.name, s.ends_at
    from public.clash_seasons s
    where s.status = 'ended'
      and exists (
        select 1
        from public.clash_season_winners w
        where w.season_id = s.id
      )
    order by s.ends_at desc
    limit greatest(coalesce(p_limit, 12), 1)
  )
  select
    rs.id,
    rs.name,
    rs.ends_at,
    w.rank,
    w.user_id,
    p.username,
    p.display_name,
    p.avatar_url,
    w.video_id,
    w.video_title,
    w.thumbnail_url,
    w.prize_cents
  from recent_seasons rs
  join public.clash_season_winners w on w.season_id = rs.id
  join public.profiles p on p.id = w.user_id
  order by rs.ends_at desc, w.rank asc;
$$;

create or replace function public.list_season_winners(p_season_id uuid)
returns table (
  id uuid,
  season_id uuid,
  rank smallint,
  user_id uuid,
  username text,
  display_name text,
  avatar_url text,
  video_id uuid,
  video_title text,
  thumbnail_url text,
  prize_cents integer,
  trending_score numeric,
  finalized_at timestamptz
)
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
  select
    w.id,
    w.season_id,
    w.rank,
    w.user_id,
    p.username,
    p.display_name,
    p.avatar_url,
    w.video_id,
    w.video_title,
    w.thumbnail_url,
    w.prize_cents,
    w.trending_score,
    w.finalized_at
  from public.clash_season_winners w
  join public.profiles p on p.id = w.user_id
  where w.season_id = p_season_id
  order by w.rank asc;
end;
$$;

create or replace function public.list_legend_seasons()
returns table (
  season_id uuid,
  season_name text,
  season_status text,
  season_starts_at timestamptz,
  season_ends_at timestamptz,
  winners_count bigint
)
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
  select
    s.id,
    s.name,
    s.status,
    s.starts_at,
    s.ends_at,
    count(w.id) as winners_count
  from public.clash_seasons s
  left join public.clash_season_winners w on w.season_id = s.id
  group by s.id
  order by s.starts_at desc;
end;
$$;

create or replace function public.delete_season_winner(p_winner_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  delete from public.clash_season_winners
  where id = p_winner_id;

  if not found then
    raise exception 'winner not found';
  end if;
end;
$$;

create or replace function public._auto_snapshot_ended_season(p_season_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.snapshot_season_winners(p_season_id);
exception
  when others then
    null;
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

  perform public._auto_snapshot_ended_season(p_id);
end;
$$;

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
  ending_season_id uuid;
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  select s.id
  into ending_season_id
  from public.clash_seasons s
  where s.status = 'active'
  order by s.starts_at desc
  limit 1;

  if ending_season_id is not null then
    update public.clash_seasons
    set status = 'ended', updated_at = now()
    where id = ending_season_id;

    perform public._auto_snapshot_ended_season(ending_season_id);
  end if;

  select
    s.prize_rank_1_cents,
    s.prize_rank_2_cents,
    s.prize_rank_3_cents
  into prev_prize_1, prev_prize_2, prev_prize_3
  from public.clash_seasons s
  where s.id = ending_season_id;

  if ending_season_id is null then
    select
      s.prize_rank_1_cents,
      s.prize_rank_2_cents,
      s.prize_rank_3_cents
    into prev_prize_1, prev_prize_2, prev_prize_3
    from public.clash_seasons s
    order by s.starts_at desc
    limit 1;
  end if;

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
    coalesce(p_prize_rank_1_cents, prev_prize_1, 100000),
    coalesce(p_prize_rank_2_cents, prev_prize_2, 50000),
    coalesce(p_prize_rank_3_cents, prev_prize_3, 25000),
    auth.uid()
  )
  returning id into season_id;

  return season_id;
end;
$$;

create or replace function public.activate_clash_season(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  ending_season_id uuid;
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

  select s.id
  into ending_season_id
  from public.clash_seasons s
  where s.status = 'active'
    and s.id <> p_id
  limit 1;

  if ending_season_id is not null then
    update public.clash_seasons
    set status = 'ended', updated_at = now()
    where id = ending_season_id;

    perform public._auto_snapshot_ended_season(ending_season_id);
  end if;

  update public.clash_seasons
  set status = 'active', updated_at = now()
  where id = p_id;
end;
$$;

grant execute on function public.get_hall_of_legends(integer) to anon, authenticated;
grant execute on function public.snapshot_season_winners(uuid) to authenticated;
grant execute on function public.list_season_winners(uuid) to authenticated;
grant execute on function public.list_legend_seasons() to authenticated;
grant execute on function public.delete_season_winner(uuid) to authenticated;

notify pgrst, 'reload schema';
