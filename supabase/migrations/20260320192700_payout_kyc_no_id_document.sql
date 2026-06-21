-- Remove mandatory ID document photo from payout KYC.

alter table public.payout_kyc_submissions
  alter column id_document_url drop not null;

update public.payout_kyc_submissions
set id_document_url = null
where id_document_url = '';

drop function if exists public.submit_payout_kyc(text, text, text, text, text, text, text, boolean, text);

create or replace function public.submit_payout_kyc(
  p_first_name text,
  p_last_name text,
  p_country_code text,
  p_country_name text,
  p_phone text,
  p_address text,
  p_whatsapp_opt_in boolean default false,
  p_whatsapp_phone text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_first_name text;
  normalized_last_name text;
  normalized_country_code text;
  normalized_country_name text;
  normalized_phone text;
  normalized_whatsapp_phone text;
  normalized_address text;
  whatsapp_opt_in boolean := coalesce(p_whatsapp_opt_in, false);
  submission_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  normalized_first_name := trim(coalesce(p_first_name, ''));
  normalized_last_name := trim(coalesce(p_last_name, ''));
  normalized_country_code := upper(trim(coalesce(p_country_code, '')));
  normalized_country_name := trim(coalesce(p_country_name, ''));
  normalized_phone := regexp_replace(trim(coalesce(p_phone, '')), '\s+', '', 'g');
  normalized_whatsapp_phone := regexp_replace(trim(coalesce(p_whatsapp_phone, '')), '\s+', '', 'g');
  normalized_address := trim(coalesce(p_address, ''));

  if char_length(normalized_first_name) < 2 then
    raise exception 'valid first name required';
  end if;

  if char_length(normalized_last_name) < 2 then
    raise exception 'valid last name required';
  end if;

  if char_length(normalized_country_code) <> 2 then
    raise exception 'valid country required';
  end if;

  if char_length(normalized_country_name) < 2 then
    raise exception 'valid country required';
  end if;

  if char_length(normalized_phone) < 8 or normalized_phone !~ '^\+[0-9]+$' then
    raise exception 'valid phone number required';
  end if;

  if whatsapp_opt_in then
    if normalized_whatsapp_phone = '' then
      normalized_whatsapp_phone := normalized_phone;
    elsif char_length(normalized_whatsapp_phone) < 8 or normalized_whatsapp_phone !~ '^\+[0-9]+$' then
      raise exception 'valid whatsapp number required';
    end if;
  else
    normalized_whatsapp_phone := null;
  end if;

  if char_length(normalized_address) < 10 then
    raise exception 'valid address required';
  end if;

  if public.user_has_approved_payout_kyc(auth.uid()) then
    raise exception 'payout kyc already approved';
  end if;

  if exists (
    select 1
    from public.payout_kyc_submissions
    where user_id = auth.uid()
      and status = 'pending'
  ) then
    raise exception 'payout kyc submission pending';
  end if;

  insert into public.payout_kyc_submissions (
    user_id,
    first_name,
    last_name,
    country_code,
    country_name,
    phone,
    whatsapp_opt_in,
    whatsapp_phone,
    address,
    id_document_url,
    status
  )
  values (
    auth.uid(),
    normalized_first_name,
    normalized_last_name,
    normalized_country_code,
    normalized_country_name,
    normalized_phone,
    whatsapp_opt_in,
    normalized_whatsapp_phone,
    normalized_address,
    null,
    'pending'
  )
  returning id into submission_id;

  return submission_id;
end;
$$;

grant execute on function public.submit_payout_kyc(text, text, text, text, text, text, boolean, text) to authenticated;

notify pgrst, 'reload schema';
