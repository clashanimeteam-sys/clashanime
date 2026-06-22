-- Admin broadcast email campaigns

create table if not exists public.admin_broadcast_emails (
  id uuid primary key default gen_random_uuid(),
  sent_by uuid references auth.users (id) on delete set null,
  subject text not null,
  body_template text not null,
  cta_label text,
  cta_url text,
  locale text not null default 'en',
  recipient_count integer not null default 0,
  sent_count integer not null default 0,
  failed_count integer not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'sending', 'completed', 'failed')),
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists admin_broadcast_emails_created_at_idx
  on public.admin_broadcast_emails (created_at desc);

alter table public.admin_broadcast_emails enable row level security;

drop policy if exists "Staff can view admin broadcast emails" on public.admin_broadcast_emails;
create policy "Staff can view admin broadcast emails"
  on public.admin_broadcast_emails for select
  to authenticated
  using (public.is_staff());
