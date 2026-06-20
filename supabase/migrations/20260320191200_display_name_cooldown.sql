alter table public.profiles
  add column if not exists display_name_changed_at timestamptz;

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
