-- Restore Hall of Legends trending score helper used by snapshot_season_winners.

create or replace function public._clash_video_trending_score(
  p_likes integer,
  p_comments integer,
  p_created_at timestamptz,
  p_is_verified boolean,
  p_level integer
)
returns numeric
language sql
stable
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

grant execute on function public._clash_video_trending_score(integer, integer, timestamptz, boolean, integer) to authenticated;
grant execute on function public.snapshot_season_winners(uuid) to authenticated;

notify pgrst, 'reload schema';
