-- Manual channel verification badges (admin-controlled)

alter table public.profiles
  add column if not exists is_verified boolean not null default false;

create index if not exists profiles_is_verified_idx on public.profiles (is_verified);

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

  if new.is_verified is distinct from old.is_verified and not public.is_admin() then
    new.is_verified := old.is_verified;
  end if;

  return new;
end;
$$;
