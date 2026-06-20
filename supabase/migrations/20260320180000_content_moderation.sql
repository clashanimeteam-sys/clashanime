-- Content moderation and duplicate detection
alter table public.videos
  add column if not exists moderation_status text not null default 'pending'
    check (moderation_status in ('pending', 'approved', 'rejected', 'review')),
  add column if not exists file_hash text,
  add column if not exists perceptual_hash text,
  add column if not exists thumb_hash text,
  add column if not exists rejection_reason text,
  add column if not exists scanned_at timestamptz;

create index if not exists videos_moderation_status_idx on public.videos (moderation_status);
create unique index if not exists videos_file_hash_unique_idx
  on public.videos (file_hash)
  where file_hash is not null and moderation_status <> 'rejected';

create table if not exists public.content_fingerprints (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos (id) on delete cascade,
  file_hash text not null,
  perceptual_hash text,
  thumb_hash text,
  created_at timestamptz not null default now()
);

create unique index if not exists content_fingerprints_file_hash_idx
  on public.content_fingerprints (file_hash);

create index if not exists content_fingerprints_perceptual_hash_idx
  on public.content_fingerprints (perceptual_hash);

alter table public.content_fingerprints enable row level security;

create policy "Fingerprints readable by authenticated users"
  on public.content_fingerprints for select
  to authenticated
  using (true);

-- Approve legacy seed and existing uploads
update public.videos
set moderation_status = 'approved',
    scanned_at = coalesce(scanned_at, now())
where moderation_status = 'pending';

create table if not exists public.content_reports (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos (id) on delete cascade,
  reporter_id uuid references auth.users (id) on delete set null,
  reason text not null default 'copyright',
  details text,
  created_at timestamptz not null default now()
);

create index if not exists content_reports_video_id_idx on public.content_reports (video_id);

alter table public.content_reports enable row level security;

create policy "Authenticated users can report content"
  on public.content_reports for insert
  to authenticated
  with check (auth.uid() = reporter_id);

create policy "Users can read own reports"
  on public.content_reports for select
  using (auth.uid() = reporter_id);

-- Replace open video read policy with moderation-aware policies
drop policy if exists "Videos are viewable by everyone" on public.videos;

create policy "Public can view approved videos"
  on public.videos for select
  using (moderation_status = 'approved');

create policy "Users can view own videos"
  on public.videos for select
  using (auth.uid() = user_id);

create or replace function public.hamming_distance_hex(a text, b text)
returns integer
language plpgsql
immutable
as $$
declare
  ba bytea;
  bb bytea;
  i integer;
  distance integer := 0;
  x integer;
begin
  if a is null or b is null or length(a) <> length(b) then
    return 9999;
  end if;

  begin
    ba := decode(a, 'hex');
    bb := decode(b, 'hex');
  exception
    when others then
      return 9999;
  end;

  if length(ba) <> length(bb) then
    return 9999;
  end if;

  for i in 0..length(ba) - 1 loop
    x := get_byte(ba, i) # get_byte(bb, i);
    while x > 0 loop
      distance := distance + (x & 1);
      x := x >> 1;
    end loop;
  end loop;

  return distance;
end;
$$;

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

  if (
    select count(*)
    from public.videos
    where user_id = p_user_id
      and moderation_status in ('approved', 'review', 'pending')
  ) < 2 then
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
    on conflict (file_hash) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists register_video_fingerprint_trigger on public.videos;

create trigger register_video_fingerprint_trigger
  after insert on public.videos
  for each row
  execute function public.register_video_fingerprint();

grant execute on function public.scan_upload_content(text, text, text, uuid) to authenticated;
grant execute on function public.hamming_distance_hex(text, text) to authenticated;
