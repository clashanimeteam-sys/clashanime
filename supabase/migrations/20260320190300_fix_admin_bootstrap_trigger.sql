-- Allow postgres / service role to bootstrap admin without the guard trigger blocking it.

create or replace function public.guard_profile_privileged_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if current_user in ('postgres', 'supabase_admin')
    or coalesce(auth.jwt()->>'role', '') = 'service_role' then
    return new;
  end if;

  if new.role is distinct from old.role and not public.is_admin() then
    new.role := old.role;
  end if;

  if new.is_banned is distinct from old.is_banned and not public.is_admin() then
    new.is_banned := old.is_banned;
  end if;

  return new;
end;
$$;

alter table public.profiles disable trigger guard_profile_privileged_fields_trigger;

update public.profiles
set role = 'admin'
where username = 'clashanimeteam'
   or id = 'e0399a69-015b-4b18-bdc8-3e790fba2f04';

alter table public.profiles enable trigger guard_profile_privileged_fields_trigger;
