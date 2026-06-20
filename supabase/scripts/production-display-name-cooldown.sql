-- Run in Supabase SQL Editor (production: doqiuduigbdoczdzsima)
-- Limits channel display name changes to once every 14 days for regular users.

alter table public.profiles
  add column if not exists display_name_changed_at timestamptz;

-- Lock existing channels until 14 days after their last profile update.
update public.profiles
set display_name_changed_at = coalesce(updated_at, created_at, now())
where display_name_changed_at is null;

create or replace function public.enforce_display_name_cooldown()
returns trigger
language plpgsql
as $$
begin
  if new.display_name is distinct from old.display_name then
    if not public.is_staff() then
      if old.display_name_changed_at is not null
         and old.display_name_changed_at > now() - interval '14 days' then
        raise exception 'DISPLAY_NAME_COOLDOWN: Channel name can only be changed once every 14 days.';
      end if;

      new.display_name_changed_at := now();
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_display_name_cooldown on public.profiles;

create trigger profiles_display_name_cooldown
  before update on public.profiles
  for each row
  execute function public.enforce_display_name_cooldown();

create or replace function public.update_own_profile_settings(
  p_bio text,
  p_display_name text
)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile public.profiles;
  v_next_name text;
  v_name_changed boolean;
begin
  select *
  into v_profile
  from public.profiles
  where id = auth.uid()
  for update;

  if v_profile.id is null then
    raise exception 'Profile not found';
  end if;

  v_next_name := nullif(trim(p_display_name), '');
  if v_next_name is null then
    v_next_name := v_profile.username;
  end if;

  v_name_changed := v_next_name is distinct from coalesce(v_profile.display_name, v_profile.username);

  if v_name_changed and not public.is_staff() then
    if v_profile.display_name_changed_at is not null
       and v_profile.display_name_changed_at > now() - interval '14 days' then
      raise exception 'DISPLAY_NAME_COOLDOWN: Channel name can only be changed once every 14 days.';
    end if;
  end if;

  update public.profiles
  set
    bio = trim(p_bio),
    display_name = case when v_name_changed then v_next_name else display_name end,
    display_name_changed_at = case
      when v_name_changed and not public.is_staff() then now()
      else display_name_changed_at
    end,
    updated_at = now()
  where id = auth.uid()
  returning * into v_profile;

  return v_profile;
end;
$$;

revoke all on function public.update_own_profile_settings(text, text) from public;
grant execute on function public.update_own_profile_settings(text, text) to authenticated;
