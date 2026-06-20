-- Run in Supabase SQL Editor (production: doqiuduigbdoczdzsima)
-- https://supabase.com/dashboard/project/doqiuduigbdoczdzsima/sql/new
--
-- Restrict community posting to Hunter ranks A and S (2001+ points).
-- Safe to re-run.

create or replace function public.can_post_to_community(target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = coalesce(target_user_id, auth.uid())
      and (
        public.is_staff()
        or public.points_to_level(p.points) >= 3
      )
  );
$$;

drop policy if exists "Authenticated users can create community posts" on public.community_posts;

create policy "Hunter A and S can create community posts"
  on public.community_posts for insert
  with check (
    auth.uid() = user_id
    and public.can_post_to_community(auth.uid())
  );

drop policy if exists "Users upload own community images" on storage.objects;

create policy "Hunter A and S upload own community images"
  on storage.objects for insert
  with check (
    bucket_id = 'community-images'
    and auth.uid()::text = (storage.foldername (name))[1]
    and public.can_post_to_community(auth.uid())
  );

select
  (select count(*) from pg_policies where policyname = 'Hunter A and S can create community posts') as community_post_policy,
  (select count(*) from pg_policies where policyname = 'Hunter A and S upload own community images') as community_image_policy;
