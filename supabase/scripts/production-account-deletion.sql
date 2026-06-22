-- Production: account deletion audit log
-- Run in Supabase SQL Editor

create table if not exists public.account_deletion_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  email text not null,
  display_name text,
  locale text not null default 'en',
  farewell_resend_id text,
  farewell_status text not null
    check (farewell_status in ('sent', 'failed', 'skipped')),
  error_message text,
  deleted_at timestamptz not null default now()
);

create index if not exists account_deletion_log_deleted_at_idx
  on public.account_deletion_log (deleted_at desc);

alter table public.account_deletion_log enable row level security;

drop policy if exists "Staff can view account deletion log" on public.account_deletion_log;
create policy "Staff can view account deletion log"
  on public.account_deletion_log for select
  to authenticated
  using (public.is_staff());

notify pgrst, 'reload schema';
