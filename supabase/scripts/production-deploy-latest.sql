-- Run in Supabase SQL Editor (production: doqiuduigbdoczdzsima)
-- https://supabase.com/dashboard/project/doqiuduigbdoczdzsima/sql/new
--
-- Applies the latest schema needed for admin moderation log + reports.
-- Safe to re-run (uses IF NOT EXISTS / DROP POLICY IF EXISTS).

-- 1) Moderation audit log (admin panel → /admin/moderation-log)
create table if not exists public.moderation_actions (
  id uuid primary key default gen_random_uuid(),
  video_id uuid references public.videos (id) on delete set null,
  target_user_id uuid references auth.users (id) on delete set null,
  staff_id uuid not null references auth.users (id) on delete cascade,
  action text not null check (
    action in ('approve', 'reject', 'review', 'delete', 'verify_channel', 'unverify_channel', 'ban_user', 'unban_user')
  ),
  previous_status text,
  new_status text,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists moderation_actions_created_at_idx
  on public.moderation_actions (created_at desc);

create index if not exists moderation_actions_video_id_idx
  on public.moderation_actions (video_id);

alter table public.moderation_actions enable row level security;

drop policy if exists "Staff can view moderation actions" on public.moderation_actions;
create policy "Staff can view moderation actions"
  on public.moderation_actions for select
  using (public.is_staff());

drop policy if exists "Staff can insert moderation actions" on public.moderation_actions;
create policy "Staff can insert moderation actions"
  on public.moderation_actions for insert
  with check (public.is_staff() and auth.uid() = staff_id);

-- 2) Verify admin tables exist for reports panel (/admin/reports)
alter table public.content_reports
  add column if not exists status text not null default 'open'
    check (status in ('open', 'resolved', 'dismissed')),
  add column if not exists admin_notes text,
  add column if not exists handled_by uuid references auth.users (id) on delete set null,
  add column if not exists handled_at timestamptz;

create index if not exists content_reports_status_idx on public.content_reports (status);

-- 3) Health check
select
  (select count(*) from public.moderation_actions) as moderation_log_count,
  (select count(*) from public.content_reports) as content_reports_count,
  (select count(*) from public.profiles where role in ('admin', 'moderator')) as staff_count;
