-- Admin visibility for instant episode clashes (active + recent winners).

create or replace function public.list_episode_clashes_admin(p_limit integer default 24)
returns table (
  clash_id uuid,
  clash_title text,
  anime_title text,
  episode_number integer,
  clash_status text,
  opens_at timestamptz,
  closes_at timestamptz,
  finalized_at timestamptz,
  winner_video_id uuid,
  winner_display_name text,
  winner_points_awarded integer,
  winner_coins_awarded integer,
  clip_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    c.id as clash_id,
    c.title as clash_title,
    ar.title as anime_title,
    ar.episode_number,
    c.status as clash_status,
    c.opens_at,
    c.closes_at,
    c.finalized_at,
    c.winner_video_id,
    coalesce(nullif(trim(p.display_name), ''), p.username) as winner_display_name,
    c.winner_points_awarded,
    c.winner_coins_awarded,
    (
      select count(*)::bigint
      from public.videos v
      where v.moderation_status = 'approved'
        and v.created_at >= c.opens_at
        and (c.closes_at is null or v.created_at <= c.closes_at)
        and public._video_matches_anime_tags(v.hashtags, c.match_tags)
    ) as clip_count
  from public.anime_release_clashes c
  join public.anime_releases ar on ar.clash_id = c.id
  left join public.profiles p on p.id = c.winner_user_id
  order by
    case when c.status = 'active' then 0 else 1 end,
    coalesce(c.closes_at, c.opens_at) desc nulls last
  limit greatest(coalesce(p_limit, 24), 1);
$$;

grant execute on function public.list_episode_clashes_admin(integer) to authenticated, service_role;

notify pgrst, 'reload schema';
