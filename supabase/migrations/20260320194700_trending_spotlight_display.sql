-- Trending spotlight: display titles, resilient joins, launch notification

alter table public.anime_trending_spotlight
  add column if not exists title_en text,
  add column if not exists title_ar text,
  add column if not exists title_ja text,
  add column if not exists launch_notified boolean not null default false;

update public.anime_trending_spotlight set title_en = 'Jujutsu Kaisen (Season 3 — Culling Game Arc)', title_ar = 'Jujutsu Kaisen (الموسم الثالث - قتال النخبة)', title_ja = '呪術廻戦（第3期 — 死滅回游編）' where rank = 1;
update public.anime_trending_spotlight set title_en = 'Gachiakuta', title_ar = 'Gachiakuta', title_ja = 'ガチアクタ' where rank = 2;
update public.anime_trending_spotlight set title_en = 'SAKAMOTO DAYS', title_ar = 'SAKAMOTO DAYS', title_ja = 'SAKAMOTO DAYS' where rank = 3;
update public.anime_trending_spotlight set title_en = 'My Hero Academia (Final Season)', title_ar = 'My Hero Academia (الموسم الأخير / النهائي)', title_ja = '僕のヒーローアカデミア（最終期）' where rank = 4;
update public.anime_trending_spotlight set title_en = 'Solo Leveling (Season 2)', title_ar = 'Solo Leveling (الموسم الثاني)', title_ja = '俺だけレベルアップな件（第2期）' where rank = 5;
update public.anime_trending_spotlight set title_en = 'Frieren: Beyond Journey''s End (Season 2)', title_ar = 'Frieren: Beyond Journey''s End (الموسم الثاني)', title_ja = '葬送のフリーレン（第2期）' where rank = 6;
update public.anime_trending_spotlight set title_en = 'Demon Slayer: Infinity Castle', title_ar = 'Demon Slayer: Kimetsu no Yaiba – Infinity Castle', title_ja = '鬼滅の刃 無限城編' where rank = 7;
update public.anime_trending_spotlight set title_en = 'DAN DA DAN', title_ar = 'DAN DA DAN', title_ja = 'ダンダダン' where rank = 8;
update public.anime_trending_spotlight set title_en = 'Daemons of the Shadow Realm', title_ar = 'Daemons of the Shadow Realm', title_ja = '黄泉のツガイ' where rank = 9;
update public.anime_trending_spotlight set title_en = 'Witch Hat Atelier', title_ar = 'Witch Hat Atelier', title_ja = 'とんがり帽子のアトリエ' where rank = 10;

-- Link any existing trending releases that were not attached to spotlight rows
update public.anime_trending_spotlight s
set release_id = ar.id,
    synced_at = coalesce(s.synced_at, now()),
    updated_at = now()
from public.anime_releases ar
where s.release_id is null
  and ar.mal_id = s.mal_id
  and ar.source = 'trending';

create or replace function public.notify_trending_spotlight_launch()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1
    from public.anime_trending_spotlight
    where launch_notified = true
  ) then
    return false;
  end if;

  if not exists (
    select 1
    from public.anime_trending_spotlight s
    join public.anime_releases ar on ar.id = s.release_id
    where s.active = true
      and ar.clash_id is not null
  ) then
    return false;
  end if;

  perform public._notify_all_users(
    'anime_release_clash',
    'Trending anime clashes are live',
    'The top 10 trending anime arena is open. Upload your best clips and join the battles!',
    '/tracker',
    jsonb_build_object('kind', 'trending_spotlight_launch')
  );

  update public.anime_trending_spotlight
  set launch_notified = true,
      updated_at = now();

  return true;
end;
$$;

grant execute on function public.notify_trending_spotlight_launch() to service_role;

drop function if exists public.get_trending_spotlight_cards();

create or replace function public.get_trending_spotlight_cards()
returns table (
  rank integer,
  mal_id integer,
  editorial_en text,
  editorial_ar text,
  editorial_ja text,
  seed_title_en text,
  seed_title_ar text,
  seed_title_ja text,
  release_id uuid,
  clash_id uuid,
  anime_title text,
  title_ar text,
  title_ja text,
  episode_number integer,
  episodes_total integer,
  poster_url text,
  synopsis_en text,
  synopsis_ar text,
  synopsis_ja text,
  mal_score numeric,
  broadcast_label text,
  airing_status text,
  match_tags text[],
  opens_at timestamptz,
  closes_at timestamptz,
  clip_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    s.rank,
    s.mal_id,
    s.editorial_en,
    s.editorial_ar,
    s.editorial_ja,
    s.title_en as seed_title_en,
    s.title_ar as seed_title_ar,
    s.title_ja as seed_title_ja,
    ar.id as release_id,
    coalesce(c.id, ar.clash_id) as clash_id,
    coalesce(nullif(trim(ar.title), ''), s.title_en) as anime_title,
    coalesce(ar.title_ar, s.title_ar) as title_ar,
    coalesce(ar.title_ja, s.title_ja) as title_ja,
    coalesce(ar.episode_number, 1) as episode_number,
    ar.episodes_total,
    ar.poster_url,
    ar.synopsis_en,
    ar.synopsis_ar,
    ar.synopsis_ja,
    ar.mal_score,
    ar.broadcast_label,
    ar.airing_status,
    coalesce(c.match_tags, ar.match_tags, '{}'::text[]) as match_tags,
    c.opens_at,
    c.closes_at,
    (
      select count(*)
      from public.videos v
      where v.moderation_status = 'approved'
        and coalesce(c.id, ar.clash_id) is not null
        and public._video_matches_anime_tags(
          v.hashtags,
          coalesce(c.match_tags, ar.match_tags, '{}'::text[])
        )
    ) as clip_count
  from public.anime_trending_spotlight s
  left join public.anime_releases ar
    on ar.id = s.release_id
    or (s.release_id is null and ar.mal_id = s.mal_id and ar.source = 'trending')
  left join public.anime_release_clashes c
    on c.id = ar.clash_id
  where s.active = true
  order by s.rank asc;
$$;

grant execute on function public.get_trending_spotlight_cards() to anon, authenticated, service_role;

notify pgrst, 'reload schema';
