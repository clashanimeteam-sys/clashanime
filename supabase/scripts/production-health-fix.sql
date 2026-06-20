-- Run in Supabase SQL Editor (production: doqiuduigbdoczdzsima)
-- https://supabase.com/dashboard/project/doqiuduigbdoczdzsima/sql/new

drop trigger if exists register_video_fingerprint_trigger on public.videos;

-- Full contents of migration 20260320190500_fix_fingerprints_mandatory_review.sql

create or replace function public.register_video_fingerprint()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.file_hash is null then
    return new;
  end if;

  if new.moderation_status in ('approved', 'review', 'pending') then
    insert into public.content_fingerprints (video_id, file_hash, perceptual_hash, thumb_hash)
    values (new.id, new.file_hash, new.perceptual_hash, new.thumb_hash)
    on conflict (file_hash) do update
      set video_id = excluded.video_id,
          perceptual_hash = excluded.perceptual_hash,
          thumb_hash = excluded.thumb_hash;
  end if;

  return new;
end;
$$;

drop trigger if exists register_video_fingerprint_insert_trigger on public.videos;

create trigger register_video_fingerprint_insert_trigger
  after insert on public.videos
  for each row
  execute function public.register_video_fingerprint();

drop trigger if exists register_video_fingerprint_update_trigger on public.videos;

create trigger register_video_fingerprint_update_trigger
  after update of file_hash, perceptual_hash, thumb_hash, moderation_status on public.videos
  for each row
  when (
    new.file_hash is not null
    and new.moderation_status in ('approved', 'review', 'pending')
  )
  execute function public.register_video_fingerprint();

insert into public.content_fingerprints (video_id, file_hash, perceptual_hash, thumb_hash)
select id, file_hash, perceptual_hash, thumb_hash
from public.videos
where file_hash is not null
  and moderation_status in ('approved', 'review', 'pending')
on conflict (file_hash) do update
  set video_id = excluded.video_id,
      perceptual_hash = excluded.perceptual_hash,
      thumb_hash = excluded.thumb_hash;

create or replace function public.scan_upload_content(
  p_file_hash text,
  p_perceptual_hash text,
  p_thumb_hash text,
  p_user_id uuid default auth.uid(),
  p_suspicion_score integer default 0,
  p_suspicion_flags text[] default '{}'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  existing record;
  candidate record;
  creator_verified boolean := false;
  max_distance constant integer := 14;
  reject_score constant integer := 45;
  review_score constant integer := 20;
begin
  if p_user_id is null then
    return jsonb_build_object(
      'status', 'rejected',
      'reason', 'auth_required'
    );
  end if;

  if p_file_hash is null or length(trim(p_file_hash)) = 0 then
    return jsonb_build_object(
      'status', 'rejected',
      'reason', 'missing_fingerprint'
    );
  end if;

  if coalesce(p_suspicion_score, 0) >= reject_score then
    return jsonb_build_object(
      'status', 'rejected',
      'reason', 'likely_reupload',
      'flags', to_jsonb(coalesce(p_suspicion_flags, '{}'::text[]))
    );
  end if;

  select v.id, v.user_id, v.moderation_status
  into existing
  from public.content_fingerprints cf
  join public.videos v on v.id = cf.video_id
  where cf.file_hash = p_file_hash
    and v.moderation_status <> 'rejected'
  limit 1;

  if found then
    return jsonb_build_object(
      'status', 'rejected',
      'reason', 'duplicate_file',
      'match_video_id', existing.id
    );
  end if;

  if p_thumb_hash is not null then
    select v.id
    into existing
    from public.content_fingerprints cf
    join public.videos v on v.id = cf.video_id
    where cf.thumb_hash = p_thumb_hash
      and v.moderation_status <> 'rejected'
    limit 1;

    if found then
      return jsonb_build_object(
        'status', 'rejected',
        'reason', 'duplicate_thumbnail',
        'match_video_id', existing.id
      );
    end if;
  end if;

  if p_perceptual_hash is not null then
    for candidate in
      select cf.video_id, cf.perceptual_hash
      from public.content_fingerprints cf
      join public.videos v on v.id = cf.video_id
      where cf.perceptual_hash is not null
        and v.moderation_status <> 'rejected'
    loop
      if public.hamming_distance_hex(candidate.perceptual_hash, p_perceptual_hash) <= max_distance then
        return jsonb_build_object(
          'status', 'rejected',
          'reason', 'duplicate_visual',
          'match_video_id', candidate.video_id
        );
      end if;
    end loop;
  end if;

  select coalesce(is_verified, false)
  into creator_verified
  from public.profiles
  where id = p_user_id;

  if coalesce(p_suspicion_score, 0) >= review_score then
    return jsonb_build_object(
      'status', 'review',
      'reason', 'suspicious_content',
      'flags', to_jsonb(coalesce(p_suspicion_flags, '{}'::text[]))
    );
  end if;

  if not creator_verified then
    return jsonb_build_object(
      'status', 'review',
      'reason', 'manual_review_required'
    );
  end if;

  return jsonb_build_object(
    'status', 'approved',
    'reason', 'verified_creator'
  );
end;
$$;

grant execute on function public.scan_upload_content(text, text, text, uuid, integer, text[]) to authenticated;

update public.videos
set moderation_status = 'review'
where file_hash is not null
  and moderation_status = 'approved'
  and user_id is not null
  and user_id not in (
    select id from public.profiles where is_verified = true
  );

select count(*) as fingerprint_count from public.content_fingerprints;
