-- Episode clash rewards: 2,000 points only (no ClashCoins).

create or replace function public._notify_episode_clash_opened(
  p_clash_id uuid,
  p_anime_title text,
  p_episode_number integer,
  p_tags text[],
  p_kind text default 'episode'
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_link text;
  v_hashtag_hint text;
  v_title text;
  v_body text;
begin
  v_link := '/tracker/clash/' || p_clash_id::text;
  v_hashtag_hint := array_to_string(
    array(
      select '#' || tag
      from unnest(coalesce(p_tags, '{}'::text[])) as tag
      limit 4
    ),
    ' '
  );

  if p_kind = 'trending' then
    v_title := 'Daily trending clash — 24 hours';
    v_body := trim(p_anime_title) || ' Ep ' || coalesce(p_episode_number, 1)::text
      || ' is live for 24 hours! Use ' || v_hashtag_hint
      || ' — winner gets +2,000 points.';
  else
    v_title := 'Instant episode clash — 24 hours only';
    v_body := trim(p_anime_title) || ' Ep ' || coalesce(p_episode_number, 1)::text
      || ' is live for 24 hours! Use ' || v_hashtag_hint
      || ' and upload your best scene now. Winner gets +2,000 points.';
  end if;

  perform public._notify_all_users(
    'anime_release_clash',
    v_title,
    v_body,
    v_link,
    jsonb_build_object(
      'clash_id', p_clash_id,
      'anime_title', p_anime_title,
      'episode_number', coalesce(p_episode_number, 1),
      'match_tags', to_jsonb(coalesce(p_tags, '{}'::text[])),
      'primary_hashtag', 'clashanime',
      'hashtag_hint', v_hashtag_hint,
      'window_hours', 24,
      'reward_points', 2000,
      'kind', p_kind
    )
  );
end;
$$;

create or replace function public.finalize_expired_anime_release_clashes()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer := 0;
  v_points constant integer := 2000;
  r record;
  w record;
  v_winner_name text;
  v_link text;
begin
  for r in
    select
      c.id as clash_id,
      c.title as clash_title,
      ar.title as anime_title,
      ar.episode_number
    from public.anime_release_clashes c
    join public.anime_releases ar on ar.clash_id = c.id
    where c.status = 'active'
      and c.closes_at is not null
      and c.closes_at <= now()
      and c.finalized_at is null
    order by c.closes_at asc
  loop
    select
      ranked.id,
      ranked.user_id,
      ranked.title
    into w
    from public.get_anime_release_clash_videos(r.clash_id, 1) as ranked
    limit 1;

    if found and w.user_id is not null then
      perform public.award_points(
        w.user_id,
        v_points,
        'episode_clash_winner',
        jsonb_build_object(
          'clash_id', r.clash_id,
          'video_id', w.id,
          'anime_title', r.anime_title,
          'episode_number', r.episode_number
        )
      );

      update public.anime_release_clashes
      set
        status = 'ended',
        finalized_at = now(),
        winner_video_id = w.id,
        winner_user_id = w.user_id,
        winner_points_awarded = v_points,
        winner_coins_awarded = null
      where id = r.clash_id;

      select coalesce(nullif(trim(p.display_name), ''), p.username, 'A hunter')
      into v_winner_name
      from public.profiles p
      where p.id = w.user_id;

      v_link := '/video/' || w.id::text;

      perform public._insert_user_notification(
        w.user_id,
        'episode_clash_winner',
        'You are the episode king!',
        'You won ' || r.clash_title || ' with +' || v_points::text || ' points.',
        v_link,
        jsonb_build_object(
          'clash_id', r.clash_id,
          'video_id', w.id,
          'anime_title', r.anime_title,
          'episode_number', r.episode_number,
          'points_awarded', v_points,
          'badge_label', 'Episode ' || r.episode_number::text || ' King'
        )
      );

      perform public._notify_all_users(
        'episode_clash_crowned',
        'Episode king crowned',
        v_winner_name || ' won ' || r.clash_title || ' — the 24-hour window is closed.',
        v_link,
        jsonb_build_object(
          'clash_id', r.clash_id,
          'video_id', w.id,
          'winner_user_id', w.user_id,
          'winner_display_name', v_winner_name,
          'anime_title', r.anime_title,
          'episode_number', r.episode_number
        )
      );
    else
      update public.anime_release_clashes
      set
        status = 'ended',
        finalized_at = now()
      where id = r.clash_id;
    end if;

    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;

notify pgrst, 'reload schema';
