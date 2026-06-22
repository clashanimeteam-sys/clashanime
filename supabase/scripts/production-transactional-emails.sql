-- Production: transactional email log + welcome email RPCs
-- Run in Supabase SQL Editor on clashanime project

create table if not exists public.transactional_emails (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  email_to text not null,
  email_type text not null,
  locale text not null default 'en',
  subject text,
  resend_id text,
  status text not null default 'pending'
    check (status in ('pending', 'sent', 'failed')),
  error_message text,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  unique (user_id, email_type)
);

create index if not exists transactional_emails_type_status_idx
  on public.transactional_emails (email_type, status);

create index if not exists transactional_emails_created_at_idx
  on public.transactional_emails (created_at desc);

alter table public.transactional_emails enable row level security;

drop policy if exists "Staff can view transactional emails" on public.transactional_emails;
create policy "Staff can view transactional emails"
  on public.transactional_emails for select
  to authenticated
  using (public.is_staff());

create or replace function public.reserve_transactional_email(
  p_user_id uuid,
  p_email_to text,
  p_email_type text,
  p_locale text default 'en'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if p_user_id is null or coalesce(trim(p_email_to), '') = '' or coalesce(trim(p_email_type), '') = '' then
    return null;
  end if;

  insert into public.transactional_emails (user_id, email_to, email_type, locale, status)
  values (p_user_id, lower(trim(p_email_to)), trim(p_email_type), coalesce(nullif(trim(p_locale), ''), 'en'), 'pending')
  on conflict (user_id, email_type) do nothing
  returning id into v_id;

  return v_id;
end;
$$;

create or replace function public.complete_transactional_email(
  p_id uuid,
  p_status text,
  p_resend_id text default null,
  p_error_message text default null,
  p_subject text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_id is null then
    return;
  end if;

  update public.transactional_emails
  set
    status = case when p_status in ('sent', 'failed') then p_status else status end,
    resend_id = coalesce(p_resend_id, resend_id),
    error_message = p_error_message,
    subject = coalesce(p_subject, subject),
    sent_at = case when p_status = 'sent' then now() else sent_at end
  where id = p_id;
end;
$$;

revoke all on function public.reserve_transactional_email(uuid, text, text, text) from public;
revoke all on function public.complete_transactional_email(uuid, text, text, text, text) from public;

grant execute on function public.reserve_transactional_email(uuid, text, text, text) to service_role;
grant execute on function public.complete_transactional_email(uuid, text, text, text, text) to service_role;

notify pgrst, 'reload schema';
