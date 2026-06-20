-- Points, referrals, levels, community posts, verification requests

alter table public.profiles
  add column if not exists points integer not null default 0 check (points >= 0),
  add column if not exists level smallint not null default 1 check (level between 1 and 4),
  add column if not exists referred_by uuid references auth.users (id) on delete set null;

create index if not exists profiles_points_idx on public.profiles (points desc);
create index if not exists profiles_level_idx on public.profiles (level desc);

alter table public.videos
  add column if not exists trending_bonus_awarded boolean not null default false;

create table if not exists public.referral_clicks (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references auth.users (id) on delete cascade,
  visitor_hash text not null,
  created_at timestamptz not null default now(),
  unique (referrer_id, visitor_hash)
);

create index if not exists referral_clicks_referrer_idx on public.referral_clicks (referrer_id);

alter table public.referral_clicks enable row level security;

create policy "Staff can read referral clicks"
  on public.referral_clicks for select
  using (public.is_staff());

create table if not exists public.point_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  amount integer not null,
  reason text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists point_transactions_user_idx on public.point_transactions (user_id, created_at desc);

alter table public.point_transactions enable row level security;

create policy "Users can read own point transactions"
  on public.point_transactions for select
  using (auth.uid() = user_id);

create policy "Staff can read all point transactions"
  on public.point_transactions for select
  using (public.is_staff());

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists community_posts_created_at_idx on public.community_posts (created_at desc);
create index if not exists community_posts_user_idx on public.community_posts (user_id);

alter table public.community_posts enable row level security;

create policy "Anyone can read community posts"
  on public.community_posts for select
  using (true);

create policy "Authenticated users can create community posts"
  on public.community_posts for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own community posts"
  on public.community_posts for delete
  using (auth.uid() = user_id);

create table if not exists public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  message text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  admin_notes text,
  created_at timestamptz not null default now(),
  handled_at timestamptz,
  handled_by uuid references auth.users (id) on delete set null
);

create index if not exists verification_requests_status_idx on public.verification_requests (status);
create unique index if not exists verification_requests_pending_user_idx
  on public.verification_requests (user_id)
  where status = 'pending';

alter table public.verification_requests enable row level security;

create policy "Users can read own verification requests"
  on public.verification_requests for select
  using (auth.uid() = user_id);

create policy "Staff can read verification requests"
  on public.verification_requests for select
  using (public.is_staff());

create policy "Users can request verification"
  on public.verification_requests for insert
  with check (auth.uid() = user_id and status = 'pending');

create policy "Staff can update verification requests"
  on public.verification_requests for update
  using (public.is_staff());

create or replace function public.points_to_level(target_points integer)
returns smallint
language plpgsql
immutable
as $$
begin
  if target_points >= 5000 then
    return 4;
  elsif target_points >= 2001 then
    return 3;
  elsif target_points >= 501 then
    return 2;
  end if;

  return 1;
end;
$$;

create or replace function public.award_points(
  target_user_id uuid,
  point_amount integer,
  point_reason text,
  point_metadata jsonb default '{}'::jsonb
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  next_points integer;
  next_level smallint;
begin
  if target_user_id is null or point_amount = 0 then
    return 0;
  end if;

  update public.profiles
  set
    points = points + point_amount,
    updated_at = now()
  where id = target_user_id
  returning points into next_points;

  if not found then
    return 0;
  end if;

  next_level := public.points_to_level(next_points);

  update public.profiles
  set
    level = next_level,
    is_verified = case when next_level >= 4 then true else is_verified end,
    updated_at = now()
  where id = target_user_id;

  insert into public.point_transactions (user_id, amount, reason, metadata)
  values (target_user_id, point_amount, point_reason, coalesce(point_metadata, '{}'::jsonb));

  return next_points;
end;
$$;

create or replace function public.track_referral_click(
  referrer_username text,
  visitor_hash text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  referrer_profile public.profiles%rowtype;
  click_id uuid;
begin
  if referrer_username is null or visitor_hash is null then
    return false;
  end if;

  select * into referrer_profile
  from public.profiles
  where lower(username) = lower(trim(referrer_username))
  limit 1;

  if not found then
    return false;
  end if;

  insert into public.referral_clicks (referrer_id, visitor_hash)
  values (referrer_profile.id, visitor_hash)
  on conflict (referrer_id, visitor_hash) do nothing
  returning id into click_id;

  if click_id is null then
    return false;
  end if;

  perform public.award_points(referrer_profile.id, 10, 'referral_click', jsonb_build_object('visitor_hash', visitor_hash));
  return true;
end;
$$;

create or replace function public.complete_referral_signup(
  new_user_id uuid,
  referrer_username text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  referrer_profile public.profiles%rowtype;
begin
  if new_user_id is null or referrer_username is null then
    return false;
  end if;

  select * into referrer_profile
  from public.profiles
  where lower(username) = lower(trim(referrer_username))
  limit 1;

  if not found or referrer_profile.id = new_user_id then
    return false;
  end if;

  update public.profiles
  set referred_by = referrer_profile.id
  where id = new_user_id
    and referred_by is null;

  if not found then
    return false;
  end if;

  perform public.award_points(referrer_profile.id, 100, 'referral_signup', jsonb_build_object('referred_user_id', new_user_id));
  return true;
end;
$$;

create or replace function public.request_channel_verification(request_message text default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  request_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if exists (
    select 1 from public.profiles
    where id = auth.uid() and is_verified = true
  ) then
    raise exception 'already verified';
  end if;

  if exists (
    select 1 from public.verification_requests
    where user_id = auth.uid() and status = 'pending'
  ) then
    raise exception 'request already pending';
  end if;

  insert into public.verification_requests (user_id, message)
  values (auth.uid(), nullif(trim(request_message), ''))
  returning id into request_id;

  return request_id;
end;
$$;

create or replace function public.award_trending_bonus(target_video_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  video_row public.videos%rowtype;
begin
  select * into video_row
  from public.videos
  where id = target_video_id
    and moderation_status = 'approved'
    and trending_bonus_awarded = false
  for update;

  if not found or video_row.user_id is null then
    return false;
  end if;

  update public.videos
  set trending_bonus_awarded = true
  where id = target_video_id;

  perform public.award_points(video_row.user_id, 500, 'trending_bonus', jsonb_build_object('video_id', target_video_id));
  return true;
end;
$$;

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

    perform public.award_points(new.user_id, 5, 'video_like', jsonb_build_object('video_id', new.video_id));
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
  perform public.award_points(new.user_id, 50, 'community_post', jsonb_build_object('post_id', new.id));
  return new;
end;
$$;

drop trigger if exists community_post_points_trigger on public.community_posts;

create trigger community_post_points_trigger
  after insert on public.community_posts
  for each row
  execute function public.award_community_post_points();

create or replace function public.award_video_upload_points()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.user_id is null then
    return new;
  end if;

  if exists (
    select 1
    from public.point_transactions
    where user_id = new.user_id
      and reason = 'video_upload'
      and metadata ->> 'video_id' = new.id::text
  ) then
    return new;
  end if;

  if tg_op = 'INSERT' and new.moderation_status = 'approved' then
    perform public.award_points(new.user_id, 20, 'video_upload', jsonb_build_object('video_id', new.id));
  elsif tg_op = 'UPDATE'
    and new.moderation_status = 'approved'
    and old.moderation_status is distinct from 'approved' then
    perform public.award_points(new.user_id, 20, 'video_upload', jsonb_build_object('video_id', new.id));
  end if;

  return new;
end;
$$;

drop trigger if exists video_upload_points_trigger on public.videos;

create trigger video_upload_points_trigger
  after insert or update of moderation_status on public.videos
  for each row
  execute function public.award_video_upload_points();

create or replace function public.guard_profile_privileged_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if current_user in ('postgres', 'supabase_admin')
    or coalesce(auth.jwt()->>'role', '') = 'service_role' then
    return new;
  end if;

  if new.role is distinct from old.role and not public.is_admin() then
    new.role := old.role;
  end if;

  if new.is_banned is distinct from old.is_banned and not public.is_admin() then
    new.is_banned := old.is_banned;
  end if;

  if new.is_verified is distinct from old.is_verified and not public.is_admin() then
    new.is_verified := old.is_verified;
  end if;

  if new.points is distinct from old.points then
    new.points := old.points;
  end if;

  if new.level is distinct from old.level then
    new.level := old.level;
  end if;

  if new.referred_by is distinct from old.referred_by then
    new.referred_by := old.referred_by;
  end if;

  return new;
end;
$$;

grant execute on function public.track_referral_click(text, text) to anon, authenticated, service_role;
grant execute on function public.complete_referral_signup(uuid, text) to authenticated, service_role;
grant execute on function public.request_channel_verification(text) to authenticated;
grant execute on function public.award_trending_bonus(uuid) to authenticated, service_role;
grant execute on function public.points_to_level(integer) to anon, authenticated;
