-- Trending spotlight clashes must use the same 24-hour window (was 30 days, extended on every sync).

-- Close active clashes whose window already ended under a 24h cap.
update public.anime_release_clashes c
set
  status = 'ended',
  finalized_at = coalesce(c.finalized_at, now()),
  closes_at = coalesce(c.closes_at, c.opens_at + interval '24 hours')
where c.status = 'active'
  and c.closes_at is not null
  and c.closes_at <= now();

update public.anime_release_clashes c
set
  status = 'ended',
  finalized_at = coalesce(c.finalized_at, now()),
  closes_at = c.opens_at + interval '24 hours'
where c.status = 'active'
  and c.opens_at is not null
  and c.opens_at + interval '24 hours' <= now()
  and (c.closes_at is null or c.closes_at > c.opens_at + interval '24 hours');

-- Cap any still-active clash to at most 24 hours from opens_at.
update public.anime_release_clashes c
set closes_at = c.opens_at + interval '24 hours'
where c.status = 'active'
  and c.opens_at is not null
  and (
    c.closes_at is null
    or c.closes_at > c.opens_at + interval '24 hours'
  );

-- Fresh reset for clashes that still show more than 24 hours remaining (legacy 7d/30d windows).
update public.anime_release_clashes c
set
  opens_at = now(),
  closes_at = now() + interval '24 hours'
where c.status = 'active'
  and c.closes_at is not null
  and c.closes_at > now() + interval '24 hours';

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
  v_clash public.anime_release_clashes%rowtype;
  v_tags text[];
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

  v_tags := public._resolve_anime_match_tags(v_release.id, v_release.match_tags, v_release.title);

  if v_release.clash_id is not null then
    select * into v_clash
    from public.anime_release_clashes
    where id = v_release.clash_id;

    if v_clash.status = 'active'
      and v_clash.closes_at is not null
      and least(v_clash.closes_at, v_clash.opens_at + interval '24 hours') > now() then
      update public.anime_release_clashes
      set
        match_tags = v_tags,
        closes_at = least(v_clash.closes_at, v_clash.opens_at + interval '24 hours')
      where id = v_release.clash_id;

      update public.anime_releases
      set
        match_tags = v_tags,
        updated_at = now()
      where id = p_release_id;

      return v_release.clash_id;
    end if;

    update public.anime_release_clashes
    set
      status = 'active',
      match_tags = v_tags,
      opens_at = now(),
      closes_at = now() + interval '24 hours',
      finalized_at = null,
      winner_video_id = null,
      winner_user_id = null,
      winner_points_awarded = null,
      winner_coins_awarded = null
    where id = v_release.clash_id;

    update public.anime_releases
    set
      match_tags = v_tags,
      updated_at = now()
    where id = p_release_id;

    return v_release.clash_id;
  end if;

  v_clash_title := trim(v_release.title) || ' · Ep ' || coalesce(v_release.episode_number, 1)::text;

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
    v_tags,
    now(),
    now() + interval '24 hours',
    true
  )
  returning id into v_clash_id;

  update public.anime_releases
  set
    clash_id = v_clash_id,
    match_tags = v_tags,
    updated_at = now()
  where id = p_release_id;

  return v_clash_id;
end;
$$;

grant execute on function public.open_trending_spotlight_clash(uuid) to service_role;

notify pgrst, 'reload schema';
