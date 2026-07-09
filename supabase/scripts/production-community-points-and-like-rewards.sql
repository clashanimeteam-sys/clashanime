-- Production: community post 5 points, remove like rewards, revoke on admin delete
-- Run in Supabase SQL editor.

create or replace function public.sync_video_likes_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  like_weight integer := 1;
  user_level smallint := 1;
begin
  if tg_op = 'INSERT' then
    select level into user_level from public.profiles where id = new.user_id;
    if coalesce(user_level, 1) >= 3 then
      like_weight := 2;
    end if;

    update public.videos
    set likes_count = likes_count + like_weight
    where id = new.video_id;
  elsif tg_op = 'DELETE' then
    select level into user_level from public.profiles where id = old.user_id;
    if coalesce(user_level, 1) >= 3 then
      like_weight := 2;
    end if;

    update public.videos
    set likes_count = greatest(likes_count - like_weight, 0)
    where id = old.video_id;
  end if;

  return null;
end;
$$;

create or replace function public.award_community_post_points()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.award_points(new.user_id, 5, 'community_post', jsonb_build_object('post_id', new.id));
  return new;
end;
$$;

create or replace function public.revoke_community_post_points_on_admin_delete()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  awarded_amount integer;
begin
  if not public.is_staff() then
    return old;
  end if;

  select amount into awarded_amount
  from public.point_transactions
  where user_id = old.user_id
    and reason = 'community_post'
    and metadata ->> 'post_id' = old.id::text
  order by created_at desc
  limit 1;

  if awarded_amount is null or awarded_amount <= 0 then
    return old;
  end if;

  if exists (
    select 1
    from public.point_transactions
    where user_id = old.user_id
      and reason = 'community_post_revoke'
      and metadata ->> 'post_id' = old.id::text
  ) then
    return old;
  end if;

  perform public.award_points(
    old.user_id,
    -awarded_amount,
    'community_post_revoke',
    jsonb_build_object('post_id', old.id, 'deleted_by', 'admin')
  );

  return old;
end;
$$;

drop trigger if exists community_post_admin_revoke_points_trigger on public.community_posts;

create trigger community_post_admin_revoke_points_trigger
  before delete on public.community_posts
  for each row
  execute function public.revoke_community_post_points_on_admin_delete();
