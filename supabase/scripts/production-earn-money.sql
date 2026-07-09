-- Earn Money promotional task submissions ($2 ClashCoins reward per approved task)
-- Run on production Supabase SQL editor if migration was not applied via CLI.

create table if not exists public.earn_money_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  task_type text not null check (task_type in ('youtube', 'forum', 'blog')),
  content_url text not null,
  notes text,
  locale text not null default 'en',
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  reward_cents integer not null default 200,
  admin_note text,
  reviewed_by uuid references auth.users (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists earn_money_submissions_status_idx
  on public.earn_money_submissions (status);
create index if not exists earn_money_submissions_user_idx
  on public.earn_money_submissions (user_id, created_at desc);
create index if not exists earn_money_submissions_task_idx
  on public.earn_money_submissions (task_type, status);

create unique index if not exists earn_money_submissions_user_task_pending_uidx
  on public.earn_money_submissions (user_id, task_type)
  where status = 'pending';

alter table public.earn_money_submissions enable row level security;

drop policy if exists "Users can view own earn money submissions" on public.earn_money_submissions;
create policy "Users can view own earn money submissions"
  on public.earn_money_submissions for select
  to authenticated
  using (auth.uid() = user_id or public.is_staff());

drop policy if exists "Staff can update earn money submissions" on public.earn_money_submissions;
create policy "Staff can update earn money submissions"
  on public.earn_money_submissions for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

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
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  normalized_task := lower(trim(coalesce(p_task_type, '')));
  normalized_url := trim(coalesce(p_content_url, ''));
  normalized_notes := nullif(trim(coalesce(p_notes, '')), '');
  normalized_locale := coalesce(nullif(trim(coalesce(p_locale, '')), ''), 'en');

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
    locale
  )
  values (
    auth.uid(),
    normalized_task,
    normalized_url,
    normalized_notes,
    normalized_locale
  )
  returning id into submission_id;

  return submission_id;
end;
$$;

create or replace function public.review_earn_money_submission(
  p_submission_id uuid,
  p_action text,
  p_admin_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  submission_row public.earn_money_submissions%rowtype;
  normalized_action text;
  next_balance integer;
begin
  if not public.is_staff() then
    raise exception 'staff only';
  end if;

  normalized_action := lower(trim(coalesce(p_action, '')));

  if normalized_action not in ('approve', 'reject') then
    raise exception 'invalid action';
  end if;

  select * into submission_row
  from public.earn_money_submissions
  where id = p_submission_id
  for update;

  if not found then
    raise exception 'submission not found';
  end if;

  if submission_row.status <> 'pending' then
    raise exception 'submission already reviewed';
  end if;

  if normalized_action = 'approve' then
    next_balance := public.award_clash_coins(
      submission_row.user_id,
      submission_row.reward_cents,
      'earn_money_reward',
      jsonb_build_object(
        'submission_id', submission_row.id,
        'task_type', submission_row.task_type,
        'content_url', submission_row.content_url
      )
    );

    update public.earn_money_submissions
    set
      status = 'approved',
      admin_note = nullif(trim(coalesce(p_admin_note, '')), ''),
      reviewed_by = auth.uid(),
      reviewed_at = now()
    where id = submission_row.id;

    return jsonb_build_object(
      'status', 'approved',
      'reward_cents', submission_row.reward_cents,
      'wallet_balance_cents', next_balance
    );
  end if;

  update public.earn_money_submissions
  set
    status = 'rejected',
    admin_note = nullif(trim(coalesce(p_admin_note, '')), ''),
    reviewed_by = auth.uid(),
    reviewed_at = now()
  where id = submission_row.id;

  return jsonb_build_object('status', 'rejected');
end;
$$;

grant execute on function public.submit_earn_money_submission(text, text, text, text) to authenticated;
grant execute on function public.review_earn_money_submission(uuid, text, text) to authenticated;
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
