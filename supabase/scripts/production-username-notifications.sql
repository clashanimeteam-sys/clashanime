-- Production: username cooldown, hashtag search, notifications
-- Run in Supabase SQL Editor

alter table public.profiles
  add column if not exists username_changed_at timestamptz;

update public.profiles
set username_changed_at = coalesce(created_at, now())
where username_changed_at is null;

create or replace function public.enforce_username_change_rules()
returns trigger
language plpgsql
as $$
declare
  v_next_username text;
begin
  if new.username is distinct from old.username then
    v_next_username := lower(regexp_replace(trim(new.username), '[^a-z0-9_]', '', 'g'));

    if v_next_username = '' or char_length(v_next_username) < 3 then
      raise exception 'USERNAME_INVALID: Username must be at least 3 characters (a-z, 0-9, _).';
    end if;

    new.username := v_next_username;

    if not public.is_staff() then
      if old.username_changed_at is not null
         and old.username_changed_at > now() - interval '30 days' then
        raise exception 'USERNAME_COOLDOWN: Username can only be changed once every 30 days.';
      end if;

      if exists (
        select 1
        from public.profiles p
        where p.username = new.username
          and p.id <> old.id
      ) then
        raise exception 'USERNAME_TAKEN: Username already exists.';
      end if;

      new.username_changed_at := now();
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_username_change_rules on public.profiles;

create trigger profiles_username_change_rules
  before update of username on public.profiles
  for each row
  execute function public.enforce_username_change_rules();

create or replace function public.update_own_profile_settings(
  p_bio text,
  p_display_name text,
  p_username text default null
)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile public.profiles;
  v_next_name text;
  v_next_username text;
  v_name_changed boolean;
  v_username_changed boolean;
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

  v_username_changed := false;
  v_next_username := v_profile.username;

  if p_username is not null and trim(p_username) <> '' then
    v_next_username := lower(regexp_replace(trim(replace(trim(p_username), '@', '')), '[^a-z0-9_]', '', 'g'));

    if v_next_username <> v_profile.username then
      v_username_changed := true;

      if char_length(v_next_username) < 3 then
        raise exception 'USERNAME_INVALID: Username must be at least 3 characters (a-z, 0-9, _).';
      end if;

      if not public.is_staff() then
        if v_profile.username_changed_at is not null
           and v_profile.username_changed_at > now() - interval '30 days' then
          raise exception 'USERNAME_COOLDOWN: Username can only be changed once every 30 days.';
        end if;

        if exists (
          select 1
          from public.profiles p
          where p.username = v_next_username
            and p.id <> v_profile.id
        ) then
          raise exception 'USERNAME_TAKEN: Username already exists.';
        end if;
      end if;
    end if;
  end if;

  update public.profiles
  set
    bio = trim(p_bio),
    display_name = case when v_name_changed then v_next_name else display_name end,
    username = case when v_username_changed then v_next_username else username end,
    display_name_changed_at = case
      when v_name_changed and not public.is_staff() then now()
      else display_name_changed_at
    end,
    username_changed_at = case
      when v_username_changed and not public.is_staff() then now()
      else username_changed_at
    end,
    updated_at = now()
  where id = auth.uid()
  returning * into v_profile;

  return v_profile;
end;
$$;

revoke all on function public.update_own_profile_settings(text, text, text) from public;
grant execute on function public.update_own_profile_settings(text, text, text) to authenticated;

create or replace function public.search_hashtags(
  p_query text,
  p_limit integer default 8
)
returns table (
  tag text,
  usage_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with tags as (
    select lower(trim(both '#' from unnest(coalesce(v.hashtags, '{}'::text[])))) as tag
    from public.videos v
    where v.moderation_status = 'approved'
  )
  select tag, count(*)::bigint as usage_count
  from tags
  where tag <> ''
    and (
      coalesce(nullif(trim(p_query), ''), '') = ''
      or tag ilike trim(both '#' from p_query) || '%'
    )
  group by tag
  order by usage_count desc, tag asc
  limit greatest(1, least(coalesce(p_limit, 8), 20));
$$;

grant execute on function public.search_hashtags(text, integer) to anon, authenticated, service_role;

create table if not exists public.user_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null default 'system',
  title text not null,
  body text not null,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists user_notifications_user_unread_idx
  on public.user_notifications (user_id, created_at desc)
  where read_at is null;

create index if not exists user_notifications_user_created_idx
  on public.user_notifications (user_id, created_at desc);

alter table public.user_notifications enable row level security;

drop policy if exists "Users can view own notifications" on public.user_notifications;
create policy "Users can view own notifications"
  on public.user_notifications for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can update own notifications" on public.user_notifications;
create policy "Users can update own notifications"
  on public.user_notifications for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.user_notification_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  in_app_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_notification_preferences enable row level security;

drop policy if exists "Users can view own notification preferences" on public.user_notification_preferences;
create policy "Users can view own notification preferences"
  on public.user_notification_preferences for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can upsert own notification preferences" on public.user_notification_preferences;
create policy "Users can upsert own notification preferences"
  on public.user_notification_preferences for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own notification preferences" on public.user_notification_preferences;
create policy "Users can update own notification preferences"
  on public.user_notification_preferences for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Staff can view all notifications" on public.user_notifications;
create policy "Staff can view all notifications"
  on public.user_notifications for select
  to authenticated
  using (public.is_staff());

notify pgrst, 'reload schema';
