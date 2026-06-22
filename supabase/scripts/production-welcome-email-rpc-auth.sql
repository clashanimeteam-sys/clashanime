-- Production: fix welcome email RPC permissions + retry failed sends
-- Run in Supabase SQL Editor after production-transactional-emails.sql

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

  if auth.uid() is not null and auth.uid() <> p_user_id then
    return null;
  end if;

  insert into public.transactional_emails (user_id, email_to, email_type, locale, status)
  values (p_user_id, lower(trim(p_email_to)), trim(p_email_type), coalesce(nullif(trim(p_locale), ''), 'en'), 'pending')
  on conflict (user_id, email_type) do update
    set
      email_to = excluded.email_to,
      locale = excluded.locale,
      status = 'pending',
      error_message = null,
      resend_id = null,
      subject = null,
      sent_at = null,
      created_at = now()
    where transactional_emails.status <> 'sent'
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
  where id = p_id
    and (
      auth.role() = 'service_role'
      or user_id = auth.uid()
    );
end;
$$;

revoke all on function public.reserve_transactional_email(uuid, text, text, text) from public;
revoke all on function public.complete_transactional_email(uuid, text, text, text, text) from public;

grant execute on function public.reserve_transactional_email(uuid, text, text, text) to authenticated, service_role;
grant execute on function public.complete_transactional_email(uuid, text, text, text, text) to authenticated, service_role;

notify pgrst, 'reload schema';
