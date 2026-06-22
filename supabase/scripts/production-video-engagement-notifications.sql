-- Run manually in Supabase SQL Editor (production)
-- Requires production-notification-events.sql first

create or replace function public.trg_notify_video_like()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_video public.videos%rowtype;
  v_liker public.profiles%rowtype;
  v_name text;
begin
  select * into v_video from public.videos where id = new.video_id;

  if not found or v_video.user_id is null or v_video.user_id = new.user_id then
    return new;
  end if;

  select * into v_liker from public.profiles where id = new.user_id;
  v_name := coalesce(nullif(trim(v_liker.display_name), ''), v_liker.username, 'Someone');

  perform public._insert_user_notification(
    v_video.user_id,
    'video_like',
    'New like',
    v_name || ' liked your clip: ' || left(v_video.title, 120),
    '/video/' || new.video_id::text,
    jsonb_build_object(
      'actor_username', v_liker.username,
      'actor_display_name', v_name,
      'video_id', new.video_id,
      'video_title', v_video.title
    )
  );

  return new;
end;
$$;

drop trigger if exists video_likes_notify_owner on public.video_likes;

create trigger video_likes_notify_owner
  after insert on public.video_likes
  for each row
  execute function public.trg_notify_video_like();

create or replace function public.trg_notify_video_comment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_video public.videos%rowtype;
  v_commenter public.profiles%rowtype;
  v_parent public.video_comments%rowtype;
  v_name text;
  v_preview text;
  v_recipient uuid;
  v_type text;
  v_title text;
  v_body text;
begin
  select * into v_video from public.videos where id = new.video_id;
  if not found then
    return new;
  end if;

  select * into v_commenter from public.profiles where id = new.user_id;
  v_name := coalesce(nullif(trim(v_commenter.display_name), ''), v_commenter.username, 'Someone');
  v_preview := left(trim(new.body), 120);

  if new.parent_id is null then
    v_recipient := v_video.user_id;
    v_type := 'video_comment';
    v_title := 'New comment';
    v_body := v_name || ' commented on your clip';
  else
    select * into v_parent from public.video_comments where id = new.parent_id;
    if not found then
      return new;
    end if;

    v_recipient := v_parent.user_id;
    v_type := 'comment_reply';
    v_title := 'New reply';
    v_body := v_name || ' replied to your comment';
  end if;

  if v_recipient is null or v_recipient = new.user_id then
    return new;
  end if;

  perform public._insert_user_notification(
    v_recipient,
    v_type,
    v_title,
    v_body,
    '/video/' || new.video_id::text,
    jsonb_build_object(
      'actor_username', v_commenter.username,
      'actor_display_name', v_name,
      'video_id', new.video_id,
      'video_title', v_video.title,
      'comment_id', new.id,
      'preview', v_preview
    )
  );

  return new;
end;
$$;

drop trigger if exists video_comments_notify on public.video_comments;

create trigger video_comments_notify
  after insert on public.video_comments
  for each row
  execute function public.trg_notify_video_comment();

create or replace function public.trg_notify_comment_like()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_comment public.video_comments%rowtype;
  v_video public.videos%rowtype;
  v_liker public.profiles%rowtype;
  v_name text;
begin
  select * into v_comment from public.video_comments where id = new.comment_id;
  if not found or v_comment.user_id is null or v_comment.user_id = new.user_id then
    return new;
  end if;

  select * into v_video from public.videos where id = v_comment.video_id;
  select * into v_liker from public.profiles where id = new.user_id;
  v_name := coalesce(nullif(trim(v_liker.display_name), ''), v_liker.username, 'Someone');

  perform public._insert_user_notification(
    v_comment.user_id,
    'comment_like',
    'Comment liked',
    v_name || ' liked your comment',
    '/video/' || v_comment.video_id::text,
    jsonb_build_object(
      'actor_username', v_liker.username,
      'actor_display_name', v_name,
      'video_id', v_comment.video_id,
      'video_title', coalesce(v_video.title, ''),
      'comment_id', new.comment_id,
      'preview', left(trim(v_comment.body), 120)
    )
  );

  return new;
end;
$$;

drop trigger if exists video_comment_likes_notify_author on public.video_comment_likes;

create trigger video_comment_likes_notify_author
  after insert on public.video_comment_likes
  for each row
  execute function public.trg_notify_comment_like();

notify pgrst, 'reload schema';
