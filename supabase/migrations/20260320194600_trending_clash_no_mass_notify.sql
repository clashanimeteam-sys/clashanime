-- Trending spotlight clashes: skip mass notifications (evergreen, not new releases)

create or replace function public.open_trending_spotlight_clash(p_release_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_release public.anime_releases%rowtype;
  v_clash_id uuid;
  v_clash_title text;
begin
  select * into v_release
  from public.anime_releases
  where id = p_release_id
  for update;

  if not found then
    raise exception 'release not found';
  end if;

  if v_release.source <> 'trending' then
    raise exception 'not a trending release';
  end if;

  if v_release.clash_id is not null then
    update public.anime_release_clashes
    set
      status = 'active',
      closes_at = greatest(coalesce(closes_at, now()), now() + interval '30 days'),
      match_tags = public._normalize_anime_match_tags(v_release.match_tags, v_release.title)
    where id = v_release.clash_id;

    return v_release.clash_id;
  end if;

  v_clash_title := trim(v_release.title) || ' · Trending';

  insert into public.anime_release_clashes (
    title,
    status,
    match_tags,
    opens_at,
    closes_at,
    notification_sent
  )
  values (
    v_clash_title,
    'active',
    public._normalize_anime_match_tags(v_release.match_tags, v_release.title),
    now(),
    now() + interval '30 days',
    true
  )
  returning id into v_clash_id;

  update public.anime_releases
  set
    clash_id = v_clash_id,
    updated_at = now()
  where id = p_release_id;

  return v_clash_id;
end;
$$;

notify pgrst, 'reload schema';
