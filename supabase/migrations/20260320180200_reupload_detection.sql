-- Detect likely YouTube/social re-uploads via client-side heuristics
alter table public.videos
  add column if not exists suspicion_score integer not null default 0,
  add column if not exists suspicion_flags text[] not null default '{}';

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
  approved_count integer;
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

  select count(*)
  into approved_count
  from public.videos
  where user_id = p_user_id
    and moderation_status = 'approved';

  if coalesce(p_suspicion_score, 0) >= review_score then
    return jsonb_build_object(
      'status', 'review',
      'reason', 'suspicious_content',
      'flags', to_jsonb(coalesce(p_suspicion_flags, '{}'::text[]))
    );
  end if;

  if approved_count < 1 then
    return jsonb_build_object(
      'status', 'review',
      'reason', 'new_creator_review'
    );
  end if;

  return jsonb_build_object(
    'status', 'approved',
    'reason', 'original_content'
  );
end;
$$;

grant execute on function public.scan_upload_content(text, text, text, uuid, integer, text[]) to authenticated;

-- Hide the known YouTube re-upload from public feed until manually reviewed
update public.videos
set moderation_status = 'review',
    rejection_reason = null,
    suspicion_score = 55,
    suspicion_flags = array['top_text_overlay']
where id = '83b15830-41b8-4850-8d4e-89bd84759153';

delete from public.content_fingerprints
where video_id = '83b15830-41b8-4850-8d4e-89bd84759153';
