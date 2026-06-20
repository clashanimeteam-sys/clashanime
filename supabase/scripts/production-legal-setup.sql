-- Run in Supabase SQL Editor (production: doqiuduigbdoczdzsima)
-- https://supabase.com/dashboard/project/doqiuduigbdoczdzsima/sql/new
-- Adds moderation audit log for staff actions (approve/reject/delete/verify/ban)

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

select count(*) as moderation_log_count from public.moderation_actions;
