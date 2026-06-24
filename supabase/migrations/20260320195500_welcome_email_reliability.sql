-- Reliable welcome / transactional email reservation with failed-state retry.

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
  v_status text;
begin
  if p_user_id is null or coalesce(trim(p_email_to), '') = '' or coalesce(trim(p_email_type), '') = '' then
    return null;
  end if;

  if auth.uid() is not null and auth.uid() <> p_user_id then
    return null;
  end if;

  select id, status
  into v_id, v_status
  from public.transactional_emails
  where user_id = p_user_id
    and email_type = trim(p_email_type)
  for update;

  if v_id is not null then
    if v_status = 'sent' then
      return null;
    end if;

    update public.transactional_emails
    set
      email_to = lower(trim(p_email_to)),
      locale = coalesce(nullif(trim(p_locale), ''), locale),
      status = 'pending',
      error_message = null,
      resend_id = null,
      subject = null,
      sent_at = null,
      created_at = now()
    where id = v_id;

    return v_id;
  end if;

  insert into public.transactional_emails (user_id, email_to, email_type, locale, status)
  values (
    p_user_id,
    lower(trim(p_email_to)),
    trim(p_email_type),
    coalesce(nullif(trim(p_locale), ''), 'en'),
    'pending'
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.reserve_transactional_email(uuid, text, text, text) from public;
grant execute on function public.reserve_transactional_email(uuid, text, text, text) to authenticated, service_role;
