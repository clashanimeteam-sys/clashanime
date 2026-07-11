-- Production: watch onboarding gate for watchclashanime.com
-- Run in Supabase SQL editor.

alter table public.profiles
  add column if not exists watch_onboarding_completed_at timestamptz;

update public.profiles
set watch_onboarding_completed_at = coalesce(watch_onboarding_completed_at, created_at)
where watch_onboarding_completed_at is null;

create or replace function public.complete_watch_onboarding()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  update public.profiles
  set
    watch_onboarding_completed_at = coalesce(watch_onboarding_completed_at, now()),
    updated_at = now()
  where id = auth.uid();
end;
$$;

revoke all on function public.complete_watch_onboarding() from public;
grant execute on function public.complete_watch_onboarding() to authenticated;
