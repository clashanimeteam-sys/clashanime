-- Run in Supabase SQL Editor (production: doqiuduigbdoczdzsima)
-- https://supabase.com/dashboard/project/doqiuduigbdoczdzsima/sql/new

create or replace function public.get_daily_interaction_leader()
returns table (
  user_id uuid,
  username text,
  display_name text,
  avatar_url text,
  points_today bigint,
  level smallint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.id,
    p.username,
    p.display_name,
    p.avatar_url,
    coalesce(sum(pt.amount), 0)::bigint as points_today,
    p.level
  from public.point_transactions pt
  join public.profiles p on p.id = pt.user_id
  where pt.created_at >= date_trunc('day', timezone('utc', now()))
    and pt.amount > 0
    and coalesce(p.is_banned, false) = false
  group by p.id, p.username, p.display_name, p.avatar_url, p.level
  having coalesce(sum(pt.amount), 0) > 0
  order by points_today desc
  limit 1;
$$;

grant execute on function public.get_daily_interaction_leader() to anon, authenticated, service_role;
