-- Configurable earn-money reward amount (stored in site_settings)

insert into public.site_settings (key, value)
values (
  'earn_money_settings',
  '{"rewardUsd": 2}'::jsonb
)
on conflict (key) do nothing;

create or replace function public.get_earn_money_reward_cents()
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    round(
      nullif(
        (select value->>'rewardUsd' from public.site_settings where key = 'earn_money_settings'),
        ''
      )::numeric,
      2
    ) * 100,
    200
  )::integer;
$$;

create or replace function public.submit_earn_money_submission(
  p_task_type text,
  p_content_url text,
  p_notes text default null,
  p_locale text default 'en'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_task text;
  normalized_url text;
  normalized_notes text;
  normalized_locale text;
  submission_id uuid;
  reward_cents integer;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  normalized_task := lower(trim(coalesce(p_task_type, '')));
  normalized_url := trim(coalesce(p_content_url, ''));
  normalized_notes := nullif(trim(coalesce(p_notes, '')), '');
  normalized_locale := coalesce(nullif(trim(coalesce(p_locale, '')), ''), 'en');
  reward_cents := public.get_earn_money_reward_cents();

  if normalized_task not in ('youtube', 'forum', 'blog') then
    raise exception 'invalid task type';
  end if;

  if normalized_url !~ '^https?://' then
    raise exception 'valid content url required';
  end if;

  if exists (
    select 1
    from public.earn_money_submissions
    where user_id = auth.uid()
      and task_type = normalized_task
      and status = 'pending'
  ) then
    raise exception 'pending submission already exists for this task';
  end if;

  if exists (
    select 1
    from public.earn_money_submissions
    where user_id = auth.uid()
      and task_type = normalized_task
      and status = 'approved'
  ) then
    raise exception 'task already approved';
  end if;

  insert into public.earn_money_submissions (
    user_id,
    task_type,
    content_url,
    notes,
    locale,
    reward_cents
  )
  values (
    auth.uid(),
    normalized_task,
    normalized_url,
    normalized_notes,
    normalized_locale,
    reward_cents
  )
  returning id into submission_id;

  return submission_id;
end;
$$;

grant execute on function public.get_earn_money_reward_cents() to authenticated, anon;
