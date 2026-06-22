-- Public contact form messages for support inbox

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  email text not null,
  whatsapp text,
  message text not null,
  locale text not null default 'en',
  status text not null default 'open'
    check (status in ('open', 'replied', 'closed')),
  admin_reply text,
  handled_by uuid references auth.users (id) on delete set null,
  handled_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_status_idx on public.contact_messages (status);
create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index if not exists contact_messages_email_idx on public.contact_messages (email);

alter table public.contact_messages enable row level security;

drop policy if exists "Staff can view contact messages" on public.contact_messages;
create policy "Staff can view contact messages"
  on public.contact_messages for select
  to authenticated
  using (public.is_staff());

drop policy if exists "Staff can update contact messages" on public.contact_messages;
create policy "Staff can update contact messages"
  on public.contact_messages for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create or replace function public.submit_contact_message(
  p_email text,
  p_message text,
  p_whatsapp text default null,
  p_locale text default 'en'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_email text;
  normalized_message text;
  normalized_whatsapp text;
  normalized_locale text;
  message_id uuid;
begin
  normalized_email := lower(trim(coalesce(p_email, '')));
  normalized_message := trim(coalesce(p_message, ''));
  normalized_whatsapp := nullif(regexp_replace(trim(coalesce(p_whatsapp, '')), '\s+', '', 'g'), '');
  normalized_locale := coalesce(nullif(trim(coalesce(p_locale, '')), ''), 'en');

  if normalized_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'valid email required';
  end if;

  if char_length(normalized_message) < 10 then
    raise exception 'message too short';
  end if;

  if char_length(normalized_message) > 4000 then
    raise exception 'message too long';
  end if;

  if normalized_whatsapp is not null and char_length(normalized_whatsapp) < 7 then
    raise exception 'valid whatsapp number required';
  end if;

  if (
    select count(*)
    from public.contact_messages
    where email = normalized_email
      and created_at > now() - interval '1 hour'
  ) >= 5 then
    raise exception 'too many messages, try again later';
  end if;

  insert into public.contact_messages (user_id, email, whatsapp, message, locale)
  values (auth.uid(), normalized_email, normalized_whatsapp, normalized_message, normalized_locale)
  returning id into message_id;

  return message_id;
end;
$$;

revoke all on function public.submit_contact_message(text, text, text, text) from public;
grant execute on function public.submit_contact_message(text, text, text, text) to anon, authenticated;
