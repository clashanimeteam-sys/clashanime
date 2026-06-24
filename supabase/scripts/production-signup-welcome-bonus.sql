-- Universal signup welcome bonus (+25 points) for every new account.

create or replace function public.award_signup_welcome_bonus(target_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  bonus_points constant integer := 25;
begin
  if target_user_id is null then
    return false;
  end if;

  if not exists (select 1 from public.profiles where id = target_user_id) then
    return false;
  end if;

  if exists (
    select 1
    from public.point_transactions
    where user_id = target_user_id
      and reason = 'signup_welcome'
  ) then
    return false;
  end if;

  perform public.award_points(
    target_user_id,
    bonus_points,
    'signup_welcome',
    jsonb_build_object('source', 'new_account')
  );

  perform public._insert_user_notification(
    target_user_id,
    'signup_welcome',
    'Welcome bonus',
    'You earned bonus points for joining ClashAnime.',
    '/profile#hunter-system',
    jsonb_build_object('points', bonus_points)
  );

  return true;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  final_username text;
begin
  base_username := lower(
    regexp_replace(
      coalesce(split_part(new.email, '@', 1), 'clash'),
      '[^a-z0-9_]',
      '',
      'g'
    )
  );

  if base_username = '' then
    base_username := 'clash';
  end if;

  final_username := base_username || substr(replace(new.id::text, '-', ''), 1, 4);

  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    final_username,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', base_username)
  )
  on conflict (id) do nothing;

  perform public.award_signup_welcome_bonus(new.id);

  return new;
end;
$$;

grant execute on function public.award_signup_welcome_bonus(uuid) to authenticated, service_role;
