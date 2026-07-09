-- Channel violations / copyright strikes dashboard

create table if not exists public.channel_violations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  violation_type text not null check (violation_type in ('copyright', 'community', 'terms')),
  content_type text not null check (content_type in ('video', 'community_post')),
  content_id uuid,
  content_title text,
  reason text not null,
  claimant_name text,
  status text not null default 'active' check (status in ('active', 'expired', 'retracted')),
  staff_id uuid references public.profiles (id) on delete set null,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists channel_violations_user_id_idx
  on public.channel_violations (user_id, created_at desc);

create index if not exists channel_violations_status_idx
  on public.channel_violations (status, violation_type);

alter table public.channel_violations enable row level security;

create policy "Users can view own channel violations"
  on public.channel_violations for select
  using (auth.uid() = user_id);

create policy "Staff can view all channel violations"
  on public.channel_violations for select
  using (public.is_staff());

create policy "Staff can insert channel violations"
  on public.channel_violations for insert
  with check (public.is_staff());

create policy "Staff can update channel violations"
  on public.channel_violations for update
  using (public.is_staff());

create or replace function public.count_active_copyright_strikes(target_user_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.channel_violations
  where user_id = target_user_id
    and violation_type = 'copyright'
    and status = 'active'
    and (expires_at is null or expires_at > now());
$$;

create or replace function public.issue_channel_violation(
  p_user_id uuid,
  p_violation_type text,
  p_content_type text,
  p_content_id uuid default null,
  p_content_title text default null,
  p_reason text default null,
  p_claimant_name text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  violation_id uuid;
  expiry_interval interval := interval '90 days';
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  if p_user_id is null then
    raise exception 'user required';
  end if;

  if p_violation_type not in ('copyright', 'community', 'terms') then
    raise exception 'invalid violation type';
  end if;

  if p_content_type not in ('video', 'community_post') then
    raise exception 'invalid content type';
  end if;

  insert into public.channel_violations (
    user_id,
    violation_type,
    content_type,
    content_id,
    content_title,
    reason,
    claimant_name,
    staff_id,
    expires_at
  )
  values (
    p_user_id,
    p_violation_type,
    p_content_type,
    p_content_id,
    nullif(trim(p_content_title), ''),
    coalesce(nullif(trim(p_reason), ''), 'Policy violation'),
    nullif(trim(p_claimant_name), ''),
    auth.uid(),
    case when p_violation_type = 'copyright' then now() + expiry_interval else null end
  )
  returning id into violation_id;

  return violation_id;
end;
$$;

grant execute on function public.count_active_copyright_strikes(uuid) to authenticated;
grant execute on function public.issue_channel_violation(uuid, text, text, uuid, text, text, text) to authenticated;
