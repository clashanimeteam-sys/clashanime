-- Admin roles, site settings, and staff moderation policies

alter table public.profiles
  add column if not exists role text not null default 'user'
    check (role in ('user', 'moderator', 'admin')),
  add column if not exists is_banned boolean not null default false;

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_is_banned_idx on public.profiles (is_banned);

alter table public.content_reports
  add column if not exists status text not null default 'open'
    check (status in ('open', 'resolved', 'dismissed')),
  add column if not exists admin_notes text,
  add column if not exists handled_by uuid references auth.users (id) on delete set null,
  add column if not exists handled_at timestamptz;

create index if not exists content_reports_status_idx on public.content_reports (status);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

alter table public.site_settings enable row level security;

insert into public.site_settings (key, value)
values
  ('general', jsonb_build_object(
    'site_name', 'ClashAnime',
    'site_tagline', 'Duel System',
    'maintenance_mode', false,
    'allow_uploads', true,
    'allow_signups', true
  )),
  ('moderation', jsonb_build_object(
    'auto_approve_enabled', true,
    'review_new_creators', true,
    'reject_suspicious_uploads', true
  ))
on conflict (key) do nothing;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'moderator')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.guard_profile_privileged_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    new.role := old.role;
  end if;

  if new.is_banned is distinct from old.is_banned and not public.is_admin() then
    new.is_banned := old.is_banned;
  end if;

  return new;
end;
$$;

drop trigger if exists guard_profile_privileged_fields_trigger on public.profiles;

create trigger guard_profile_privileged_fields_trigger
  before update on public.profiles
  for each row
  execute function public.guard_profile_privileged_fields();

create policy "Staff can view all videos"
  on public.videos for select
  using (public.is_staff());

create policy "Staff can moderate videos"
  on public.videos for update
  using (public.is_staff());

create policy "Staff can delete videos"
  on public.videos for delete
  using (public.is_staff());

create policy "Staff can view all reports"
  on public.content_reports for select
  using (public.is_staff());

create policy "Staff can update reports"
  on public.content_reports for update
  using (public.is_staff());

create policy "Admins can update any profile"
  on public.profiles for update
  using (public.is_admin());

create policy "Anyone can read site settings"
  on public.site_settings for select
  using (true);

create policy "Admins can insert site settings"
  on public.site_settings for insert
  with check (public.is_admin());

create policy "Admins can update site settings"
  on public.site_settings for update
  using (public.is_admin());

grant execute on function public.is_staff() to authenticated;
grant execute on function public.is_admin() to authenticated;

-- Bootstrap first admin (site owner)
update public.profiles
set role = 'admin'
where username = 'wisam';
