-- Run in Supabase SQL Editor (production: doqiuduigbdoczdzsima)
-- https://supabase.com/dashboard/project/doqiuduigbdoczdzsima/sql/new

create or replace function public.search_profile_usernames(
  p_query text,
  p_exclude_user_id uuid default null,
  p_limit integer default 8
)
returns table (
  id uuid,
  username text,
  display_name text,
  avatar_url text,
  is_verified boolean
)
language sql
stable
security definer
set search_path = public
as $$
  with cleaned as (
    select nullif(trim(both '@' from coalesce(p_query, '')), '') as term
  )
  select
    p.id,
    p.username,
    p.display_name,
    p.avatar_url,
    p.is_verified
  from public.profiles p
  cross join cleaned c
  where c.term is not null
    and coalesce(p.is_banned, false) = false
    and (p_exclude_user_id is null or p.id <> p_exclude_user_id)
    and (
      p.username ilike c.term || '%'
      or coalesce(p.display_name, '') ilike '%' || c.term || '%'
    )
  order by
    case when p.username ilike c.term || '%' then 0 else 1 end,
    p.username asc
  limit greatest(1, least(coalesce(p_limit, 8), 20));
$$;

grant execute on function public.search_profile_usernames(text, uuid, integer) to anon, authenticated, service_role;
