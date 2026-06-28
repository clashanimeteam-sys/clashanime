-- Auto-detected social links: Instagram, TikTok, X, website (+ existing YouTube)

alter table public.profiles
  add column if not exists instagram_url text,
  add column if not exists tiktok_url text,
  add column if not exists twitter_url text,
  add column if not exists website_url text;

alter table public.profiles
  drop constraint if exists profiles_instagram_url_check;

alter table public.profiles
  add constraint profiles_instagram_url_check
  check (
    instagram_url is null
    or (
      char_length(trim(instagram_url)) > 0
      and char_length(instagram_url) <= 500
    )
  );

alter table public.profiles
  drop constraint if exists profiles_tiktok_url_check;

alter table public.profiles
  add constraint profiles_tiktok_url_check
  check (
    tiktok_url is null
    or (
      char_length(trim(tiktok_url)) > 0
      and char_length(tiktok_url) <= 500
    )
  );

alter table public.profiles
  drop constraint if exists profiles_twitter_url_check;

alter table public.profiles
  add constraint profiles_twitter_url_check
  check (
    twitter_url is null
    or (
      char_length(trim(twitter_url)) > 0
      and char_length(twitter_url) <= 500
    )
  );

alter table public.profiles
  drop constraint if exists profiles_website_url_check;

alter table public.profiles
  add constraint profiles_website_url_check
  check (
    website_url is null
    or (
      char_length(trim(website_url)) > 0
      and char_length(website_url) <= 500
    )
  );

drop function if exists public.update_own_profile_settings(text, text, text, text, text, text);

create or replace function public.update_own_profile_settings(
  p_bio text,
  p_display_name text,
  p_username text default null,
  p_country_code text default null,
  p_country_name text default null,
  p_youtube_url text default null,
  p_instagram_url text default null,
  p_tiktok_url text default null,
  p_twitter_url text default null,
  p_website_url text default null
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
  v_next_country_code text;
  v_next_country_name text;
  v_next_youtube text;
  v_next_instagram text;
  v_next_tiktok text;
  v_next_twitter text;
  v_next_website text;
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

  v_next_country_code := v_profile.country_code;
  v_next_country_name := v_profile.country_name;

  if p_country_code is not null and trim(p_country_code) <> '' then
    v_next_country_code := upper(trim(p_country_code));
    v_next_country_name := coalesce(nullif(trim(p_country_name), ''), v_next_country_code);
  end if;

  v_next_youtube := v_profile.youtube_url;
  if p_youtube_url is not null then
    v_next_youtube := nullif(trim(p_youtube_url), '');
  end if;

  v_next_instagram := v_profile.instagram_url;
  if p_instagram_url is not null then
    v_next_instagram := nullif(trim(p_instagram_url), '');
  end if;

  v_next_tiktok := v_profile.tiktok_url;
  if p_tiktok_url is not null then
    v_next_tiktok := nullif(trim(p_tiktok_url), '');
  end if;

  v_next_twitter := v_profile.twitter_url;
  if p_twitter_url is not null then
    v_next_twitter := nullif(trim(p_twitter_url), '');
  end if;

  v_next_website := v_profile.website_url;
  if p_website_url is not null then
    v_next_website := nullif(trim(p_website_url), '');
  end if;

  update public.profiles
  set
    bio = trim(p_bio),
    display_name = case when v_name_changed then v_next_name else display_name end,
    username = case when v_username_changed then v_next_username else username end,
    country_code = v_next_country_code,
    country_name = v_next_country_name,
    youtube_url = v_next_youtube,
    instagram_url = v_next_instagram,
    tiktok_url = v_next_tiktok,
    twitter_url = v_next_twitter,
    website_url = v_next_website,
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

revoke all on function public.update_own_profile_settings(text, text, text, text, text, text, text, text, text, text) from public;
grant execute on function public.update_own_profile_settings(text, text, text, text, text, text, text, text, text, text) to authenticated;

notify pgrst, 'reload schema';
