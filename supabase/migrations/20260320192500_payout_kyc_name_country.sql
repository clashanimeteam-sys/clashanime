-- Add name and country fields to payout KYC submissions.

alter table public.payout_kyc_submissions
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists country_code text,
  add column if not exists country_name text;

drop function if exists public.submit_payout_kyc(text, text, text);

create or replace function public.submit_payout_kyc(
  p_first_name text,
  p_last_name text,
  p_country_code text,
  p_country_name text,
  p_phone text,
  p_address text,
  p_id_document_url text
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
  normalized_address text;
  normalized_url text;
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
  normalized_address := trim(coalesce(p_address, ''));
  normalized_url := trim(coalesce(p_id_document_url, ''));

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

  if char_length(normalized_address) < 10 then
    raise exception 'valid address required';
  end if;

  if char_length(normalized_url) < 10 then
    raise exception 'id document image required';
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
    normalized_address,
    normalized_url,
    'pending'
  )
  returning id into submission_id;

  return submission_id;
end;
$$;

grant execute on function public.submit_payout_kyc(text, text, text, text, text, text, text) to authenticated;

notify pgrst, 'reload schema';
