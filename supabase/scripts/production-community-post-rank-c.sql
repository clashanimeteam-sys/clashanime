-- Production: allow Hunter rank C (1000+ points) to post in the community.

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
        or public.points_to_level(p.points) >= 2
      )
  );
$$;

drop policy if exists "Hunter A and S can create community posts" on public.community_posts;

create policy "Hunter C, A and S can create community posts"
  on public.community_posts for insert
  with check (
    auth.uid() = user_id
    and public.can_post_to_community(auth.uid())
  );

drop policy if exists "Hunter A and S upload own community images" on storage.objects;

create policy "Hunter C, A and S upload own community images"
  on storage.objects for insert
  with check (
    bucket_id = 'community-images'
    and auth.uid()::text = (storage.foldername (name))[1]
    and public.can_post_to_community(auth.uid())
  );

notify pgrst, 'reload schema';
