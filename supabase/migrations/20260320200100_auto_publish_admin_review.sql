-- Auto-publish uploads on the site while queuing them for later admin review.

alter table public.videos
  add column if not exists admin_review_pending boolean not null default false;

create index if not exists videos_admin_review_pending_idx
  on public.videos (admin_review_pending)
  where admin_review_pending = true;

-- Publish legacy queued uploads and mark them for admin follow-up.
update public.videos
set
  moderation_status = 'approved',
  admin_review_pending = true
where moderation_status in ('review', 'pending');

create or replace function public._notify_staff_users(
  p_type text,
  p_title text,
  p_body text,
  p_link text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer := 0;
  r record;
begin
  for r in
    select p.id
    from public.profiles p
    where p.role in ('admin', 'moderator')
  loop
    perform public._insert_user_notification(
      r.id,
      p_type,
      p_title,
      p_body,
      p_link,
      p_metadata
    );
    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;

create or replace function public.trg_notify_staff_video_review()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_channel public.profiles%rowtype;
  v_name text;
begin
  if tg_op = 'INSERT'
     and new.moderation_status = 'approved'
     and coalesce(new.admin_review_pending, false) = true then
    select * into v_channel from public.profiles where id = new.user_id;
    v_name := coalesce(nullif(trim(v_channel.display_name), ''), v_channel.username, 'A creator');

    perform public._notify_staff_users(
      'admin_video_review',
      'Video needs review',
      v_name || ' published: ' || left(new.title, 120),
      '/admin/videos',
      jsonb_build_object(
        'video_id', new.id,
        'video_title', new.title,
        'channel_username', v_channel.username,
        'channel_display_name', v_name
      )
    );
  end if;

  return new;
end;
$$;

drop trigger if exists videos_notify_staff_review on public.videos;

create trigger videos_notify_staff_review
  after insert on public.videos
  for each row
  execute function public.trg_notify_staff_video_review();

grant execute on function public._notify_staff_users(text, text, text, text, jsonb) to authenticated;

notify pgrst, 'reload schema';
