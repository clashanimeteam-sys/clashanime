-- Hashtag landing pages: stats, video feed, and top tags for admin/SEO

create or replace function public._normalize_hashtag(p_raw text)
returns text
language sql
immutable
as $$
  select lower(trim(both '#' from coalesce(p_raw, '')));
$$;

create or replace function public.video_has_hashtag(p_hashtags text[], p_tag text)
returns boolean
language sql
immutable
as $$
  select exists (
    select 1
    from unnest(coalesce(p_hashtags, '{}'::text[])) as h(raw)
    where public._normalize_hashtag(raw) = public._normalize_hashtag(p_tag)
      and public._normalize_hashtag(p_tag) <> ''
  );
$$;

create or replace function public.get_hashtag_page_stats(p_tag text)
returns table (
  tag text,
  video_count bigint,
  channel_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with wanted as (
    select public._normalize_hashtag(p_tag) as tag
  ),
  matching as (
    select v.id, v.user_id
    from public.videos v
    cross join wanted w
    where v.moderation_status = 'approved'
      and w.tag <> ''
      and public.video_has_hashtag(v.hashtags, w.tag)
  )
  select
    w.tag,
    coalesce((select count(*)::bigint from matching), 0::bigint) as video_count,
    coalesce((select count(distinct user_id)::bigint from matching where user_id is not null), 0::bigint) as channel_count
  from wanted w;
$$;

create or replace function public.get_hashtag_videos(
  p_tag text,
  p_limit integer default 48,
  p_offset integer default 0
)
returns table (
  id uuid,
  title text,
  thumbnail_url text,
  video_url text,
  likes_count integer,
  comments_count integer,
  views_count integer,
  shares_count integer,
  created_at timestamptz,
  user_id uuid,
  hashtags text[],
  duration_seconds integer
)
language sql
stable
security definer
set search_path = public
as $$
  with wanted as (
    select public._normalize_hashtag(p_tag) as tag
  )
  select
    v.id,
    v.title,
    v.thumbnail_url,
    v.video_url,
    v.likes_count,
    v.comments_count,
    v.views_count,
    v.shares_count,
    v.created_at,
    v.user_id,
    v.hashtags,
    v.duration_seconds
  from public.videos v
  cross join wanted w
  where v.moderation_status = 'approved'
    and w.tag <> ''
    and public.video_has_hashtag(v.hashtags, w.tag)
  order by v.created_at desc
  limit greatest(1, least(coalesce(p_limit, 48), 100))
  offset greatest(coalesce(p_offset, 0), 0);
$$;

create or replace function public.list_top_hashtags(p_limit integer default 20)
returns table (
  tag text,
  usage_count bigint,
  channel_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with tags as (
    select
      public._normalize_hashtag(raw) as tag,
      v.user_id
    from public.videos v
    cross join lateral unnest(coalesce(v.hashtags, '{}'::text[])) as h(raw)
    where v.moderation_status = 'approved'
  ),
  grouped as (
    select
      tag,
      count(*)::bigint as usage_count,
      count(distinct user_id)::bigint as channel_count
    from tags
    where tag <> ''
    group by tag
  )
  select tag, usage_count, channel_count
  from grouped
  order by usage_count desc, tag asc
  limit greatest(1, least(coalesce(p_limit, 20), 100));
$$;

grant execute on function public._normalize_hashtag(text) to anon, authenticated, service_role;
grant execute on function public.video_has_hashtag(text[], text) to anon, authenticated, service_role;
grant execute on function public.get_hashtag_page_stats(text) to anon, authenticated, service_role;
grant execute on function public.get_hashtag_videos(text, integer, integer) to anon, authenticated, service_role;
grant execute on function public.list_top_hashtags(integer) to anon, authenticated, service_role;
