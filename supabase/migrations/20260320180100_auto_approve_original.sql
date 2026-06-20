-- Auto-approve uploads that pass duplicate fingerprint checks
create or replace function public.scan_upload_content(
  p_file_hash text,
  p_perceptual_hash text,
  p_thumb_hash text,
  p_user_id uuid default auth.uid()
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  existing record;
  candidate record;
  max_distance constant integer := 12;
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

  return jsonb_build_object(
    'status', 'approved',
    'reason', 'original_content'
  );
end;
$$;
